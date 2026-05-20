export interface Mapper<T, DTO> {
  toDto(entity: T): DTO;
  toDomain(dto: DTO): T;
}
