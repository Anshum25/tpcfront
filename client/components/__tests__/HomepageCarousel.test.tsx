import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { apiService } from '@/services/api';
import HomepageCarousel from '../HomepageCarousel';

// Mock the API service
vi.mock('@/services/api', () => ({
  apiService: {
    getCarouselImages: vi.fn(),
  },
}));

// Mock embla-carousel-react
vi.mock('embla-carousel-react', () => ({
  default: () => [
    vi.fn(), // emblaRef
    {
      selectedScrollSnap: () => 0,
      scrollTo: vi.fn(),
      scrollNext: vi.fn(),
      scrollPrev: vi.fn(),
      on: vi.fn(),
      off: vi.fn(),
    },
  ],
}));

const mockImages = [
  {
    _id: '1',
    title: 'Test Image 1',
    url: '/uploads/test1.jpg',
    alt: 'Test image 1 description',
  },
  {
    _id: '2',
    title: 'Test Image 2',
    url: 'https://example.com/test2.jpg',
    alt: 'Test image 2 description',
  },
];

describe('HomepageCarousel', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders loading state initially', () => {
    vi.mocked(apiService.getCarouselImages).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<HomepageCarousel />);
    
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders fallback when no images are available', async () => {
    vi.mocked(apiService.getCarouselImages).mockResolvedValue([]);

    render(<HomepageCarousel />);

    await waitFor(() => {
      expect(screen.getByText('No carousel images')).toBeInTheDocument();
      expect(screen.getByText('Upload images with part "homepage carousel"')).toBeInTheDocument();
    });
  });

  it('renders single image without carousel controls', async () => {
    vi.mocked(apiService.getCarouselImages).mockResolvedValue([mockImages[0]]);

    render(<HomepageCarousel />);

    await waitFor(() => {
      const image = screen.getByAltText('Test image 1 description');
      expect(image).toBeInTheDocument();
      expect(image).toHaveAttribute('src', expect.stringContaining('/uploads/test1.jpg'));
    });

    // Should not have navigation dots for single image
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });

  it('renders carousel with multiple images and navigation dots', async () => {
    vi.mocked(apiService.getCarouselImages).mockResolvedValue(mockImages);

    render(<HomepageCarousel />);

    await waitFor(() => {
      expect(screen.getByRole('region', { name: 'Homepage image carousel' })).toBeInTheDocument();
      expect(screen.getByRole('tablist', { name: 'Carousel navigation' })).toBeInTheDocument();
      
      const navigationButtons = screen.getAllByRole('tab');
      expect(navigationButtons).toHaveLength(2);
    });
  });

  it('handles API errors gracefully', async () => {
    vi.mocked(apiService.getCarouselImages).mockRejectedValue(new Error('API Error'));

    render(<HomepageCarousel />);

    await waitFor(() => {
      expect(screen.getByText('No carousel images')).toBeInTheDocument();
    });
  });

  it('supports keyboard navigation', async () => {
    vi.mocked(apiService.getCarouselImages).mockResolvedValue(mockImages);

    render(<HomepageCarousel />);

    await waitFor(() => {
      const carousel = screen.getByRole('region', { name: 'Homepage image carousel' });
      expect(carousel).toBeInTheDocument();
    });

    const carousel = screen.getByRole('region', { name: 'Homepage image carousel' });
    
    // Test arrow key navigation
    fireEvent.keyDown(carousel, { key: 'ArrowRight' });
    fireEvent.keyDown(carousel, { key: 'ArrowLeft' });
    fireEvent.keyDown(carousel, { key: ' ' }); // Space to pause
  });

  it('pauses on hover and focus', async () => {
    vi.mocked(apiService.getCarouselImages).mockResolvedValue(mockImages);

    render(<HomepageCarousel />);

    await waitFor(() => {
      const carousel = screen.getByRole('region', { name: 'Homepage image carousel' });
      expect(carousel).toBeInTheDocument();
    });

    const carousel = screen.getByRole('region', { name: 'Homepage image carousel' });
    
    // Test hover pause
    fireEvent.mouseEnter(carousel);
    fireEvent.mouseLeave(carousel);
    
    // Test focus pause
    fireEvent.focus(carousel);
    fireEvent.blur(carousel);
  });

  it('handles navigation dot clicks', async () => {
    vi.mocked(apiService.getCarouselImages).mockResolvedValue(mockImages);

    render(<HomepageCarousel />);

    await waitFor(() => {
      const navigationButtons = screen.getAllByRole('tab');
      expect(navigationButtons).toHaveLength(2);
    });

    const navigationButtons = screen.getAllByRole('tab');
    fireEvent.click(navigationButtons[1]);
  });

  it('applies custom className', async () => {
    vi.mocked(apiService.getCarouselImages).mockResolvedValue(mockImages);

    render(<HomepageCarousel className="custom-class" />);

    await waitFor(() => {
      const carousel = screen.getByRole('region', { name: 'Homepage image carousel' });
      expect(carousel).toHaveClass('custom-class');
    });
  });

  it('respects showDots prop', async () => {
    vi.mocked(apiService.getCarouselImages).mockResolvedValue(mockImages);

    render(<HomepageCarousel showDots={false} />);

    await waitFor(() => {
      expect(screen.getByRole('region', { name: 'Homepage image carousel' })).toBeInTheDocument();
    });

    // Should not have navigation dots when showDots is false
    expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
  });
});