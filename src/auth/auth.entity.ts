import { ApiHideProperty, ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'credentials' })
export class Credential {
  @ApiHideProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Email of the user',
    example: 'bartolomiaw@example.com',
    uniqueItems: true,
  })
  @Column({ unique: true, select: false })
  email: string;

  @ApiHideProperty()
  @Column({ length: 60, select: false })
  password: string;
}
