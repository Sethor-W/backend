import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtBusinessStrategy extends PassportStrategy(
  Strategy,
  'business',
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    if (!payload.credential) {
      throw new UnauthorizedException();
    }
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      credential: payload.credential,
    };
  }
}
