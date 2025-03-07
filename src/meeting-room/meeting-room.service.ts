import { BadRequestException, Injectable } from '@nestjs/common';
import { MeetingRoom } from './entities/meeting-room.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Like, Repository } from 'typeorm';
import { CreateMeetingRoomDto } from './dto/create-meeting-room.dto';
import { UpdateMeetingRoomDto } from './dto/update-meeting-room.dto';

@Injectable()
export class MeetingRoomService {
  @InjectRepository(MeetingRoom)
  readonly repository: Repository<MeetingRoom>;
  @InjectEntityManager()
  entityManager: EntityManager;
  async initData() {
    const room1 = new MeetingRoom();
    room1.name = '木星';
    room1.capacity = 10;
    room1.equipment = '白板';
    room1.location = '一层西';

    const room2 = new MeetingRoom();
    room2.name = '金星';
    room2.capacity = 5;
    room2.equipment = '';
    room2.location = '二层东';

    const room3 = new MeetingRoom();
    room3.name = '天王星';
    room3.capacity = 30;
    room3.equipment = '白板，电视';
    room3.location = '三层东';

    await this.repository.insert([room1, room2, room3]);
  }
  async find(
    pageNo: number,
    pageSize: number,
    name: string,
    capacity: number,
    equipment: string,
  ) {
    if (pageNo < 1) {
      throw new BadRequestException('页码最小为 1');
    }
    const skipCount = (pageNo - 1) * pageSize;

    const condition: Record<string, any> = {};

    if (name) {
      condition.name = Like(`%${name}%`);
    }
    if (equipment) {
      condition.equipment = Like(`%${equipment}%`);
    }
    if (capacity) {
      condition.capacity = capacity;
    }

    const [meetingRooms, totalCount] = await this.repository.findAndCount({
      skip: skipCount,
      take: pageSize,
      where: condition,
    });

    return {
      meetingRooms,
      totalCount,
    };
  }

  async create(meetingRoomDto: CreateMeetingRoomDto) {
    const room = await this.repository.findOneBy({
      name: meetingRoomDto.name,
    });
    if (room) {
      throw new BadRequestException('会议室名称已存在');
    }
    return await this.repository.save(meetingRoomDto);
  }

  async update(meetingRoomDto: UpdateMeetingRoomDto) {
    const meetingRoom = await this.repository.findOneBy({
      id: meetingRoomDto.id,
    });
    if (!meetingRoom) {
      throw new BadRequestException('会议室不存在');
    }
    meetingRoom.capacity = meetingRoomDto.capacity!;
    meetingRoom.location = meetingRoomDto.location!;
    meetingRoom.name = meetingRoomDto.name!;
    if (meetingRoomDto.equipment) {
      meetingRoom.equipment = meetingRoomDto.equipment;
    }
    if (meetingRoomDto.description) {
      meetingRoom.description = meetingRoomDto.description;
    }
    await this.repository.update(meetingRoom.id, meetingRoom);
    return 'success';
  }

  /**
   * 详情
   */
  async findById(id: number) {
    return await this.repository.findOneBy({ id });
  }

  /**
   * 删除
   */
  async delete(id: number) {
    // const bookings = await this.entityManager.findBy(Booking, {
    //   room: {
    //     id,
    //   },
    // });
    // for (let i = 0; i < bookings.length; i++) {
    //   this.entityManager.delete(Booking, bookings[i].id);
    // }
    await this.repository.delete(id);
    return 'success';
  }
}
