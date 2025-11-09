import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EstudianteService } from './estudiante';

describe('EstudianteService', () => {
  let service: EstudianteService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [EstudianteService]
    });
    service = TestBed.inject(EstudianteService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
