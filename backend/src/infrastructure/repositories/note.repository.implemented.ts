import type {
  create_note_dto,
  update_note_dto,
  note_filter,
} from "../../application/dto/note.dto";
import type {
  paginated_result,
  pagination,
} from "../../application/dto/pagination.dto";
import type { note } from "../../domain/entities/note.entity";
import type { note_repository } from "../../domain/repositories/note.repository";
import { prisma } from "../config/database/prisma.config";

export class note_repository_implemented implements note_repository {
  async create_note(data: create_note_dto): Promise<note> {
    const new_note = await prisma.note.create({
      data: {
        title: data.title,
        content: data.content,
        is_archived: false,
        user_id: data.user_id,
        note_tags: {
          create: data.tag_ids?.map((tag_id) => ({
            tag: { connect: { id: tag_id } },
          })),
        },
      },
      include: {
        user: true,
        note_tags: {
          include: { tag: true },
        },
      },
    });

    const transformed = {
      ...new_note,
      tags: new_note.note_tags.map((nt: any) => nt.tag),
    };

    return transformed as unknown as note;
  }

  async update_note(data: update_note_dto): Promise<note> {
    const update_data: any = {
      updated_at: new Date(),
    };

    if (data.title !== undefined) update_data.title = data.title;
    if (data.content !== undefined) update_data.content = data.content;

    if (data.tag_ids !== undefined) {
      await prisma.note_Tag.deleteMany({
        where: { note_id: data.id },
      });

      update_data.note_tags = {
        create: data.tag_ids.map((tag_id) => ({
          tag: { connect: { id: tag_id } },
        })),
      };
    }

    const updated_note = await prisma.note.update({
      where: { id: data.id },
      data: update_data,
      include: {
        user: true,
        note_tags: {
          include: { tag: true },
        },
      },
    });

    const transformed = {
      ...updated_note,
      tags: updated_note.note_tags.map((nt: any) => nt.tag),
    };

    return transformed as unknown as note;
  }

  async find_all(
    filters: note_filter,
    pagination: pagination,
  ): Promise<{ data: note[]; pagination: paginated_result }> {
    const page = pagination.page;
    const limit = pagination.limit;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (filters.is_archived !== undefined) {
      where.is_archived = filters.is_archived;
    }

    if (filters.user_id) {
      where.user_id = filters.user_id;
    }

    if (filters.tag_id) {
      where.note_tags = {
        some: { tag_id: filters.tag_id },
      };
    }

    const [total, notes] = await Promise.all([
      prisma.note.count({ where }),
      prisma.note.findMany({
        where,
        include: {
          user: true,
          note_tags: {
            include: { tag: true },
          },
        },
        orderBy: { updated_at: "desc" },
        skip,
        take: limit,
      }),
    ]);

    const transformed_notes = notes.map((note: any) => ({
      ...note,
      tags: note.note_tags.map((nt: any) => nt.tag),
    }));

    return {
      data: transformed_notes as unknown as note[],
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

  async find_by_id(id: string): Promise<note | null> {
    const note = await prisma.note.findUnique({
      where: { id },
      include: {
        user: true,
        note_tags: {
          include: { tag: true },
        },
      },
    });
    
    if (!note) return null;

    const transformed = {
      ...note,
      tags: note.note_tags.map((nt: any) => nt.tag),
    };

    return transformed as unknown as note;
  }

  async toggle_note_state(note: note): Promise<note> {
    const toggled_note = await prisma.note.update({
      where: { id: note.id },
      data: {
        is_archived: !note.is_archived,
        updated_at: new Date(),
      },
      include: {
        note_tags: {
          include: { tag: true },
        },
      },
    });

    const transformed = {
      ...toggled_note,
      tags: toggled_note.note_tags.map((nt: any) => nt.tag),
    };

    return transformed as unknown as note;
  }

  async delete_note(note_id: string): Promise<void> {
    await prisma.note.delete({
      where: { id: note_id },
    });
  }
}
