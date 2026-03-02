import type {
  create_note_dto,
  update_note_dto,
  note_filter,
} from "../../application/dto/note.dto";
import type { pagination } from "../../application/dto/pagination.dto";
import { create_note_use_case } from "../../application/use-cases/note/create-note.use-case";
import { delete_note_use_case } from "../../application/use-cases/note/delete-note.use-case";
import { get_notes_use_case } from "../../application/use-cases/note/get-notes.use-case";
import { toggle_archive_note_use_case } from "../../application/use-cases/note/toggle-archive-note.use-case";
import { update_note_use_case } from "../../application/use-cases/note/update-note.use-case";
import type { note_repository } from "../../domain/repositories/note.repository";

export class note_controller {
  private readonly note_repository: note_repository;

  constructor(note_repository_injection: note_repository) {
    this.note_repository = note_repository_injection;
  }

  async create(token: string, data: create_note_dto) {
    try {
      const use_case = new create_note_use_case(this.note_repository);
      const result = await use_case.run(token, data);

      if (!result.success) {
        return {
          status: 400,
          message: result.error,
          error: result.error,
        };
      }

      return {
        status: 201,
        message: "Note created successfully",
        data: result.data,
      };
    } catch (error) {
      throw error;
    }
  }

  async get_all(token: string, filters: note_filter, pagination: pagination) {
    try {
      const use_case = new get_notes_use_case(this.note_repository);
      const result = await use_case.run(token, filters, pagination);

      if (!result.success) {
        return {
          status: 400,
          message: result.error,
          error: result.error,
        };
      }

      return {
        status: 200,
        message: "Notes retrieved successfully",
        data: {
          items: result.data.data,
          page: result.data.pagination.page,
          limit: result.data.pagination.limit,
          total: result.data.pagination.total,
          total_pages: result.data.pagination.total_pages,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async update(token: string, data: update_note_dto) {
    try {
      const use_case = new update_note_use_case(this.note_repository);
      const result = await use_case.run(token, data);

      if (!result.success) {
        return {
          status: 400,
          message: result.error,
          error: result.error,
        };
      }

      return {
        status: 200,
        message: "Note updated successfully",
        data: result.data,
      };
    } catch (error) {
      throw error;
    }
  }

  async toggle_archive(token: string, note_id: string) {
    try {
      const use_case = new toggle_archive_note_use_case(this.note_repository);
      const result = await use_case.run(token, note_id);

      if (!result.success) {
        return {
          status: 400,
          message: result.error,
          error: result.error,
        };
      }

      const message = result.data.is_archived
        ? "Note archived"
        : "Note unarchived";

      return {
        status: 200,
        message,
        data: result.data,
      };
    } catch (error) {
      throw error;
    }
  }

  async delete(token: string, note_id: string) {
    try {
      const use_case = new delete_note_use_case(this.note_repository);
      const result = await use_case.run(token, note_id);

      if (!result.success) {
        return {
          status: 400,
          message: result.error,
          error: result.error,
        };
      }

      return {
        status: 200,
        message: result.data,
      };
    } catch (error) {
      throw error;
    }
  }
}
