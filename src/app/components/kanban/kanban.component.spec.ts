import { TestBed } from '@angular/core/testing';
import { KanbanComponent } from './kanban.component';

describe('kanban', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KanbanComponent],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(KanbanComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render title', () => {
    const fixture = TestBed.createComponent(KanbanComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Hello, kanban-app');
  });
});
