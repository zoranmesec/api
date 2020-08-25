import { Module } from '@nestjs/common';
import { Audit } from './entities/audit.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditService } from './services/audit.service';
import { AuditSubscriber } from './subscribers/audit.subscriber';
import { AuthModule } from 'src/auth/auth.module';
import { AuditInterceptor } from './interceptors/audit.interceptor';

@Module({
    imports: [TypeOrmModule.forFeature([Audit]), AuthModule],
    providers: [AuditService, AuditSubscriber, AuditInterceptor],
    exports: [AuditService]
})
export class AuditModule { }