import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class JwtManagerStrategy extends PassportStrategy(Strategy, 'manager') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    if (!payload.type || payload.type != 'manager') {
      throw new UnauthorizedException();
    }
    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      credential: payload.credential,
      type: payload.type,
    };
  }
}
