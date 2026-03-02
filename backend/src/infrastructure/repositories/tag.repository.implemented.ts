import type {
  paginated_result,
  pagination,
} from "../../application/dto/pagination.dto";
import type { tag_dto } from "../../application/dto/tag.dto";
import type { tag } from "../../domain/entities/tag.entity";
import type { tag_repository } from "../../domain/repositories/tag.repository";
import { prisma } from "../config/database/prisma.config";

export class tag_repository_implemented implements tag_repository {
  async find_all(
    user_id: string,
    pagination?: pagination,
  ): Promise<{ data: tag[]; pagination: paginated_result }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    const where = { user_id };

    const [total, tags] = await Promise.all([
      prisma.tag.count({ where }),
      prisma.tag.findMany({
        where,
        include: {
          note_tags: {
            include: { note: true },
          },
        },
        orderBy: { name: "asc" },
        skip,
        take: limit,
      }),
    ]);

    return {
      data: tags as unknown as tag[],
      pagination: {
        total,
        page,
        limit,
        total_pages: Math.ceil(total / limit),
        has_next_page: page < Math.ceil(total / limit),
        has_prev_page: page > 1,
      },
    };
  }
  async find_by_id(id: string): Promise<tag | null> {
    const found_tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        note_tags: {
          include: { note: true },
        },
      },
    });

    return found_tag ? this.map_to_domain(found_tag) : null;
  }

  async find_by_name(tag: tag_dto): Promise<tag | null> {
    const found_tag = await prisma.tag.findUnique({
      where: {
        name: tag.name,
        user_id: tag.user_id,
      },
      include: {
        note_tags: {
          include: { note: true },
        },
      },
    });

    return found_tag ? this.map_to_domain(found_tag) : null;
  }

  async create(tag: tag_dto): Promise<tag> {
    const existing = await this.find_by_name(tag);
    if (existing) {
      throw new Error("Tag with this name already exists");
    }

    const new_tag = await prisma.tag.create({
      data: {
        name: tag.name,
        user_id: tag.user_id,
      },
      include: {
        note_tags: {
          include: { note: true },
        },
      },
    });

    return this.map_to_domain(new_tag);
  }

  async delete(id: string): Promise<void> {
    await prisma.tag.delete({
      where: { id },
    });
  }

  private map_to_domain(prisma_tag: any): tag {
    return {
      id: prisma_tag.id,
      name: prisma_tag.name,
      created_at: prisma_tag.created_at,
      note_tags: prisma_tag.note_tags || [],
      notes: prisma_tag.note_tags?.map((nt: any) => nt.note) || [],
    };
  }
}
