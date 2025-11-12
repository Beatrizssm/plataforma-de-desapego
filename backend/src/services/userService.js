import prisma from '../prisma/client.js';

class UserService {
  async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        profile: true,
        createdAt: true,
      },
    });
  }

  async getUserById(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        profile: true,
        createdAt: true,
      },
    });
  }

  async getUserByEmail(email) {
    return await prisma.user.findUnique({
      where: { email },
    });
  }

  async createUser(userData) {
    return await prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        profile: userData.profile || 'user',
      },
      select: {
        id: true,
        name: true,
        email: true,
        profile: true,
        createdAt: true,
      },
    });
  }

  async updateUser(id, userData) {
    return await prisma.user.update({
      where: { id: parseInt(id) },
      data: {
        ...(userData.name && { name: userData.name }),
        ...(userData.email && { email: userData.email }),
        ...(userData.password && { password: userData.password }),
        ...(userData.profile && { profile: userData.profile }),
      },
      select: {
        id: true,
        name: true,
        email: true,
        profile: true,
        createdAt: true,
      },
    });
  }

  async deleteUser(id) {
    return await prisma.user.delete({
      where: { id: parseInt(id) },
    });
  }
}

export default new UserService();

