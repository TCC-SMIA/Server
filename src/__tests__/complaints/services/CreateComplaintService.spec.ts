import IComplaintsRepository from '@domains/complaints/rules/IComplaintsRepository';
import CreateComplaintService from '@domains/complaints/services/CreateComplaintService';
import IStorageProvider from '@shared/providers/StorageProvider/rules/IStorageProvider';
import FakeStorageProvider from '@tests/fakeProviders/FakeStorageProvider/FakeStorageProvider';
import AppError from '@shared/errors/AppError';
import CreateNotificationService from '@domains/notifications/services/CreateNotificationService';
import INotificationsRepository from '@domains/notifications/rules/INotificationsRepository';
import FakeNotificationsRepository from '@tests/notifications/fakes/FakeNotificationsRepository';
import FakeUsersRepository from '@tests/users/fakes/FakeUsersRepository';
import IUsersRepository from '@domains/users/rules/IUsersRepository';
import { ComplaintTypeEnum } from '@domains/complaints/enums/ComplaintTypeEnum';
import { ComplaintStatusEnum } from '@domains/complaints/enums/ComplaintStatusEnum';
import { reporterMock } from '@tests/__mocks__/User.mock';
import { UserTypes } from '@domains/users/enums/UserEnums';
import FakeComplaintsRepository from '../fakes/FakeComplaintsRepository';

let fakeComplaintsRepository: IComplaintsRepository;
let fakeStorageProvider: IStorageProvider;
let createComplaintService: CreateComplaintService;
let fakeNotificationsRepository: INotificationsRepository;
let fakeUsersRepository: IUsersRepository;
let createNotificationService: CreateNotificationService;

describe('CreateComplaintService', () => {
  beforeEach(() => {
    fakeComplaintsRepository = new FakeComplaintsRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    createNotificationService = new CreateNotificationService(
      fakeNotificationsRepository,
    );

    createComplaintService = new CreateComplaintService(
      fakeComplaintsRepository,
      fakeStorageProvider,
      fakeUsersRepository,
      createNotificationService,
    );
  });

  it('should be able to create a complaint', async () => {
    const user = await fakeUsersRepository.create(reporterMock);

    const date = new Date();

    const complaint = await createComplaintService.execute({
      user_id: user.id,
      title: 'test complaint created',
      description: 'description of complaint created',
      imageFilename: 'image.jpg',
      latitude: -222222,
      longitude: 222222,
      anonymous: false,
      type: ComplaintTypeEnum.Others,
      date,
    });

    expect(complaint).toBeTruthy();
    expect(complaint.id).toBeTruthy();
    expect(complaint.title).toBe('test complaint created');
    expect(complaint.description).toBe('description of complaint created');
    expect(complaint.latitude).toBe(-222222);
    expect(complaint.longitude).toBe(222222);
    expect(complaint.type).toBe(ComplaintTypeEnum.Others);
    expect(complaint.anonymous).toBe(false);
    expect(complaint.date).toEqual(date);
    expect(complaint.image).toBe('image.jpg');
  });

  it('should be able to create a anonymous complaint', async () => {
    const createMock = jest.spyOn(fakeComplaintsRepository, 'create');

    const date = new Date();

    const user = await fakeUsersRepository.create(reporterMock);

    const complaint = await createComplaintService.execute({
      user_id: user.id,
      title: 'New anonynmous Complaint',
      description: 'We found a new planet',
      latitude: -222222,
      longitude: 222222,
      anonymous: true,
      date,
      type: ComplaintTypeEnum.Others,
    });

    expect(complaint).toBeTruthy();
    expect(complaint.id).toBeTruthy();
    expect(complaint.title).toBe('New anonynmous Complaint');
    expect(complaint.description).toBe('We found a new planet');
    expect(complaint.latitude).toBe(-222222);
    expect(complaint.longitude).toBe(222222);
    expect(complaint.type).toBe(ComplaintTypeEnum.Others);
    expect(complaint.date).toEqual(date);
    expect(createMock).toHaveBeenCalledWith({
      user_id: user.id,
      title: 'New anonynmous Complaint',
      description: 'We found a new planet',
      image: undefined,
      city: undefined,
      state: undefined,
      latitude: -222222,
      longitude: 222222,
      anonymous: true,
      type: ComplaintTypeEnum.Others,
      status: ComplaintStatusEnum.New,
      date,
    });
  });

  it('should not permit an environmental agency create a complaint', async () => {
    const date = new Date();

    const agency = await fakeUsersRepository.create({
      name: 'valid_agency_name',
      email: 'same_email@mail.com',
      cnpj: '62728791000128',
      password: 'valid_password',
      type: UserTypes.EnvironmentalAgency,
    });

    await expect(
      createComplaintService.execute({
        user_id: agency.id,
        title: 'New anonynmous Complaint',
        description: 'We found a new planet',
        latitude: -222222,
        longitude: 222222,
        anonymous: true,
        date,
        type: ComplaintTypeEnum.Others,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
