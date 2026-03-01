import type {
  paginated_result,
  pagination,
} from "../../application/dto/pagination.dto";
import type { tag_dto } from "../../application/dto/tag.dto";
import type { tag } from "../entities/tag.entity";

export interface tag_repository {
  find_all(
    pagination: pagination,
  ): Promise<{ data: tag[]; pagination: paginated_result }>;
  find_by_id(id: string): Promise<tag | null>;
  find_by_name(tag: tag_dto): Promise<tag | null>;
  create(tag: tag_dto): Promise<tag>;
  delete(id: string): Promise<void>;
}
