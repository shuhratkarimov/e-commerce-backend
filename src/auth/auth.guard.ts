import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { Request } from "express";
import { Observable } from "rxjs";
import * as jwt from "jsonwebtoken";

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return this.validateRequest(request);
  }
  private validateRequest(request: Request): boolean {
    try {
      if (!request.cookies?.accesstoken) {
        throw new UnauthorizedException("Token not found!");
      }
      const decoded = jwt.verify(
        request.cookies.accesstoken,
        process.env.ACCESS_SECRET_KEY as string,
      ) as { type: string };
      const allowedRoles = ["admin", "superadmin"];
      if (!allowedRoles.includes(decoded.type)) {
        throw new ForbiddenException("You do not have permission");
      } else {
        return true;
      }
    } catch (error) {
      return false;
    }
  }
}
