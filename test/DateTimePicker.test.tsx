// @ts-ignore
import React from 'react';
import flatpickr from 'flatpickr';
import '@testing-library/jest-dom';
import DateTimePicker from '../src/DateTimePicker';
import { render, screen, act } from '@testing-library/react';

jest.mock('flatpickr', () => {
  return jest.fn().mockImplementation(() => ({
    setDate: jest.fn(),
    destroy: jest.fn(),
    set: jest.fn(),
  }));
});

describe('DateTimePicker Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders without crashing', () => {
    render(<DateTimePicker />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toBeInTheDocument();
  });

  test('renders with default value', () => {
    const defaultValue = '2023-10-10';
    render(<DateTimePicker defaultValue={defaultValue} />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveValue(defaultValue);
  });

  test('applies custom className', () => {
    const className = 'custom-class';
    render(<DateTimePicker className={className} />);
    const inputElement = screen.getByRole('textbox');
    expect(inputElement).toHaveClass(className);
  });

  test('renders with custom render function', () => {
    const renderFunction = jest.fn(({ defaultValue, value }, ref) => (
      <div>
        <input ref={ref} defaultValue={defaultValue} value={value} />
      </div>
    ));
    render(<DateTimePicker render={renderFunction} />);
    expect(renderFunction).toHaveBeenCalled();
  });

  describe('#onCreate', () => {
    it('is called when the flatpickr instance is created', () => {
      const onCreate = jest.fn();
      render(<DateTimePicker onCreate={onCreate} />);
      expect(onCreate).toHaveBeenCalledTimes(1);
    });

    it('is possible to reference the flatpickr instance', () => {
      const onCreate = jest.fn((instance) => {
        expect(instance).toBeDefined();
        expect(instance.setDate).toBeDefined();
      });
      render(<DateTimePicker onCreate={onCreate} />);
      expect(onCreate).toHaveBeenCalledTimes(1);
    });
  });

  describe('#onDestroy', () => {
    it('is called when the flatpickr instance is destroyed', () => {
      const onDestroy = jest.fn();
      const { unmount } = render(<DateTimePicker onDestroy={onDestroy} />);
      unmount();
      expect(onDestroy).toHaveBeenCalledTimes(1);
    });
  });

  describe('#render', () => {
    it('is possible to provide a custom input', () => {
      const customRender = jest.fn((props, ref) => (
        <input ref={ref} data-testid="custom-input" {...props} />
      ));
      render(<DateTimePicker render={customRender} />);
      expect(screen.getByTestId('custom-input')).toBeInTheDocument();
    });
  });

  describe('#value', () => {
    describe('is in the YYYY-MM-DD format', () => {
      it('shows it in the input', () => {
        const value = '2023-10-15';
        render(<DateTimePicker value={value} />);
        expect(screen.getByRole('textbox')).toHaveValue(value);
      });
    });

    describe('is in the YYYY.MM.DD format', () => {
      it('normalizes it and shows in the input', () => {
        const value = '2023.10.15';
        render(<DateTimePicker value={value} />);
        expect(screen.getByRole('textbox')).toHaveValue('2023-10-15');
      });
    });
  });

  describe('is updated with a minDate', () => {
    it('updates the minDate first', async () => {
      const { rerender } = render(<DateTimePicker />);
      const minDate = '2023-10-01';
      
      await act(async () => {
        rerender(<DateTimePicker options={{ minDate }} />);
      });

    expect(flatpickr).toHaveBeenCalledTimes(2);
    const secondCall = (flatpickr as jest.MockedFunction<typeof flatpickr>).mock.calls[1];
    expect(secondCall).toBeDefined();
    expect(secondCall && secondCall[1]).toHaveProperty('minDate', minDate);    });
  });
describe('DateTimePicker', () => {
  describe('when provided with a value prop', () => {
    it('shows it in the input', () => {
      const value = '2023-10-15';
      render(<DateTimePicker value={value} />);
      expect(screen.getByRole('textbox')).toHaveValue(value);
    });

    it('handles Date object correctly', () => {
      const value = new Date('2023-10-15');
      render(<DateTimePicker value={value} />);
      expect(screen.getByRole('textbox')).toHaveValue('2023-10-15');
    });

    it('handles array of dates correctly', () => {
      const value = ['2023-10-15', '2023-10-16'];
      render(<DateTimePicker value={value} />);
      expect(screen.getByRole('textbox')).toHaveValue('2023-10-15, 2023-10-16');
    });

    it('converts YYYY.MM.DD format to YYYY-MM-DD', () => {
      const value = '2023.10.15';
      render(<DateTimePicker value={value} />);
      expect(screen.getByRole('textbox')).toHaveValue('2023-10-15');
    });
  });

  describe('when provided with a defaultValue prop', () => {
    it('shows it in the input', () => {
      const defaultValue = '2023-10-15';
      render(<DateTimePicker defaultValue={defaultValue} />);
      expect(screen.getByRole('textbox')).toHaveValue(defaultValue);
    });
  });

  describe('when provided with custom options', () => {
    it('applies the options', () => {
      const options = { dateFormat: 'Y.m.d' };
      render(<DateTimePicker options={options} value="2023-10-15" />);
      expect(screen.getByRole('textbox')).toHaveValue('2023.10.15');
    });
  });

  describe('when provided with className prop', () => {
    it('applies the className to the input', () => {
      const className = 'custom-class';
      render(<DateTimePicker className={className} />);
      expect(screen.getByRole('textbox')).toHaveClass(className);
    });
  });

  describe('when provided with a render prop', () => {
    it('uses the custom render function', () => {
      const customRender = (props: any, ref: any) => (
        <div>
          <label htmlFor="custom-input">Custom Date:</label>
          <input id="custom-input" ref={ref} {...props} />
        </div>
      );
      render(<DateTimePicker render={customRender} />);
      expect(screen.getByLabelText('Custom Date:')).toBeInTheDocument();
    });
  });
});


});