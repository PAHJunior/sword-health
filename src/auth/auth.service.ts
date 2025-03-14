import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dto/sign-in.dto';
import { AuthResponse } from './dto/auth-response.dto';
import { JwtPayloadDto } from './dto/jwt-payload.dto';
import { RefreshToken } from './dto/refresh-token.dto';
import { IBaseRepository } from 'src/helpers/interfaces/base-repository.interface';
import { UserEntity } from '../features/user/repository/user.entity';
import { UserCreateDto } from '../features/user/dto/user-create.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('UserRepository')
    private userRepository: IBaseRepository<UserEntity>,
    private readonly logger: Logger,
  ) {}

  public async validateUser(
    username: string,
    password: string,
  ): Promise<UserEntity | null> {
    const [user] = await this.userRepository.findAll(
      {
        username,
      },
      ['password'],
    );

    if (!user) {
      throw new NotFoundException('User Not Found');
    }
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const match = await bcrypt.compare(password, user.password);
      if (!match) {
        throw new UnauthorizedException('Invalid password');
      }
    } catch {
      throw new UnauthorizedException('Invalid password');
    }

    return this.userRepository.findById(user.userId);
  }

  public async create(createUser: UserCreateDto): Promise<AuthResponse> {
    const password = await this.encrypt(createUser.password);

    await this.userRepository.create({
      ...createUser,
      password,
    });

    const login = await this.login({
      username: createUser.username,
      password: createUser.password,
    });
    return login;
  }

  public async login(signIn: SignInDto): Promise<AuthResponse> {
    const user = await this.validateUser(signIn.username, signIn.password);
    if (!user) {
      throw new NotFoundException('Use not found');
    }
    const payload: JwtPayloadDto = this.buildJwtPayload(user);
    const response = this.generateAccessToken(payload);
    await this.saveRefreshToke(payload.sub, response.refreshToken);
    return response;
  }

  public async refreshTokens(body: RefreshToken): Promise<AuthResponse> {
    const { refreshToken: oldRefreshToken } = body;

    try {
      const oldPayload: JwtPayloadDto = this.jwtService.verify(oldRefreshToken);
      const user = await this.userRepository.findById(oldPayload.sub);

      if (!user || !user.refreshToken) {
        throw new UnauthorizedException('Token inválido ou expirado');
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
      const isRefreshTokenValid = await bcrypt.compare(
        oldRefreshToken,
        user.refreshToken,
      );
      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Token inválido ou expirado');
      }

      const newPayload: JwtPayloadDto = this.buildJwtPayload(user);
      const newTokens = this.generateAccessToken(newPayload);

      return newTokens;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      const stack = error instanceof Error ? error.stack : 'No stack trace';

      this.logger.error(oldRefreshToken, stack, undefined, message);
      throw new UnauthorizedException('Token inválido ou expirado');
    }
  }

  private buildJwtPayload(user: UserEntity): JwtPayloadDto {
    return {
      username: user.username,
      sub: user.userId,
      role: user.role,
    };
  }

  private async saveRefreshToke(
    sub: number,
    refreshToken: string,
  ): Promise<void> {
    const encryptRefreshToken = await this.encrypt(refreshToken);
    await this.userRepository.update(sub, {
      refreshToken: encryptRefreshToken,
    });
  }

  private generateAccessToken(payload: JwtPayloadDto): AuthResponse {
    const accessToken = this.generateToken(payload, '1d');
    const refreshToken = this.generateToken(payload, '7d');

    return { accessToken, refreshToken };
  }

  private generateToken(payload: JwtPayloadDto, expiresIn: string): string {
    return this.jwtService.sign(payload, { expiresIn });
  }

  private async encrypt(str: string): Promise<string> {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const saltRounds = await bcrypt.genSalt(10);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const encryptStr = await bcrypt.hash(str, saltRounds);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return encryptStr;
  }
}
