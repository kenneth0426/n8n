import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class VersionControlPushWorkFolder {
	@IsBoolean()
	@IsOptional()
	force?: boolean;

	@IsString({ each: true })
	@IsOptional()
	files?: Set<string>;

	@IsString()
	@IsOptional()
	message?: string;
}