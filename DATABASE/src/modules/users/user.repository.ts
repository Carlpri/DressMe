import prisma from "../../config/prisma.js";
import { updateProfileDto, changePasswordDto } from "./user.types.js";

export class UserRepository {
  async findById(id: string) {
    return prisma.user.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        role: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }


async updateProfile(
  id: string,
  data:updateProfileDto
) {
  return prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
      status: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

async findByIdWithPassword(id: string) {
    return prisma.user.findUnique({
        where: { id },
        select:{
          id: true,
          password: true,
        },
    });
  }

  async updatePassword(
    id: string,
    password:string
    ) {
        return prisma.user.update({
            where: { id },
            data: { 
                password, 
            },
        });
    
}

  

}