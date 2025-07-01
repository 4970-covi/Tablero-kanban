import { TestBed } from '@angular/core/testing';
import { Kanban } from './kanban.component';

describe('kanban', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Kanban],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(Kanban);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(Kanban);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, kanban-app');
  });
});
