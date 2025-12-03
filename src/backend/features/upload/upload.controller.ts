import { injectable, inject } from "tsyringe";
import type { AvatarData, IUploadService } from "./upload.service";
import { User } from "next-auth";

export type UploadAvatarResponse = {
	data: { avatar: AvatarData };
};

@injectable()
export class UploadController {
	constructor(
		@inject("UploadService") private readonly uploadService: IUploadService
	) {}

	/**
	 * Uploads an avatar for a user or restaurant.
	 */
	async uploadAvatar(user: User, file: File): Promise<UploadAvatarResponse> {
		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const avatarData = await this.uploadService.uploadAvatar(
			user.id!,
			user.role,
			buffer,
			file.type
		);

		return { data: { avatar: avatarData } };
	}

	/**
	 * Deletes the avatar for a user or restaurant.
	 */
	async deleteAvatar(user: User): Promise<string> {
		await this.uploadService.deleteAvatar(user.id!, user.role);
		return "Avatar deleted successfully";
	}
}
