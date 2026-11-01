// @vitest-environment jsdom
import React from 'react'
import { th } from 'react-day-picker/locale'

import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  Calendar,
  CollectionCardButton,
  CollectionCardItemCount,
  ComboboxCommandEmpty,
  ComboboxCommandInput,
  ComboboxCommandList,
  ComboboxContent,
  ComboboxProvider,
  ComboboxTrigger,
  ComboboxTriggerMultiValue,
  CommandDialog,
  DatePickerProvider,
  DatePickerTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DropZoneEmptyUploadButton,
  DropZoneEmptyUploadCaption,
  DropZoneEmptyUploadDescription,
  DropzoneProvider,
  FilePreviewStatus,
  Filter,
  PageIndex,
  PageSizeSelect,
  Pagination,
  PaginationEllipsis,
  PaginationNext,
  PaginationPrevious,
  Select,
  SelectContent,
  SelectTrigger,
  SelectValue,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  Sidebar,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from './index'

beforeAll(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe() {}
      unobserve() {}
      disconnect() {}
    }
  )
  vi.stubGlobal('matchMedia', () => ({
    matches: true,
    addEventListener() {},
    removeEventListener() {},
  }))
  Element.prototype.scrollIntoView = vi.fn()
})

afterEach(cleanup)

describe('localizable labels', () => {
  it('keeps English pagination defaults and accepts existing native accessible-name overrides', () => {
    render(
      <Pagination>
        <PaginationPrevious />
        <PaginationNext />
        <PaginationEllipsis />
        <PageIndex page={2} totalPage={5} />
        <PageSizeSelect />
      </Pagination>
    )
    expect(screen.getByRole('navigation').getAttribute('aria-label')).toBe('pagination')
    expect(screen.getByLabelText('Go to previous page')).toBeTruthy()
    expect(screen.getByLabelText('Go to next page')).toBeTruthy()
    expect(screen.getByText('More pages')).toBeTruthy()
    expect(screen.getByText('Page')).toBeTruthy()
    expect(screen.getByText('of')).toBeTruthy()
    expect(screen.getByLabelText('Show')).toBeTruthy()
  })

  it('translates pagination, summary, breadcrumbs and collection text without leaking props', () => {
    const { container } = render(
      <>
        <Pagination aria-label="เลือกหน้า">
          <PaginationPrevious aria-label="หน้าก่อน" />
          <PaginationNext aria-label="หน้าถัดไป" />
          <PaginationEllipsis label="หน้าเพิ่มเติม" />
          <PageIndex page={2} totalPage={5} labels={{ page: 'หน้า', of: 'จาก' }} />
          <PageSizeSelect label="แสดง" />
        </Pagination>
        <Breadcrumb aria-label="เส้นทาง">
          <BreadcrumbEllipsis label="เพิ่มเติม" />
        </Breadcrumb>
        <CollectionCardItemCount itemNumber={3} itemLabel="รายการ" />
        <CollectionCardButton title="ดู" />
      </>
    )
    for (const text of ['หน้าเพิ่มเติม', 'หน้า', 'จาก', 'เพิ่มเติม', '3 รายการ', 'ดู'])
      expect(screen.getByText(text)).toBeTruthy()
    for (const label of ['เลือกหน้า', 'หน้าก่อน', 'หน้าถัดไป', 'แสดง', 'เส้นทาง'])
      expect(screen.getByLabelText(label)).toBeTruthy()
    expect(container.querySelector('[label], [labels], [itemLabel]')).toBeNull()
  })

  it('retains Filter defaults when only one label is supplied, and applies selected values', () => {
    const onChange = vi.fn()
    render(
      <Filter
        options={{ Status: [{ value: 'open', label: 'เปิด', isSelected: true }] }}
        onChange={onChange}
        labels={{ trigger: 'ตัวกรอง' }}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /ตัวกรอง/ }))
    expect(screen.getByText('Apply Filters')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'Reset All' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'Apply' }))
    expect(onChange).toHaveBeenCalledWith({
      Status: [{ value: 'open', label: 'เปิด', isSelected: true }],
    })
  })

  it('translates every Filter label and preserves reset behavior', () => {
    const onChange = vi.fn()
    render(
      <Filter
        options={{ สถานะ: [{ value: 'open', label: 'เปิด', isSelected: true }] }}
        onChange={onChange}
        labels={{
          trigger: 'ตัวกรอง',
          title: 'เลือกตัวกรอง',
          resetAll: 'ล้างทั้งหมด',
          apply: 'ใช้',
        }}
      />
    )
    fireEvent.click(screen.getByRole('button', { name: /ตัวกรอง/ }))
    expect(screen.getByText('เลือกตัวกรอง')).toBeTruthy()
    expect(screen.getByRole('button', { name: 'ใช้' })).toBeTruthy()
    fireEvent.click(screen.getByRole('button', { name: 'ล้างทั้งหมด' }))
    expect(onChange).toHaveBeenCalledWith({
      สถานะ: [{ value: 'open', label: 'เปิด', isSelected: false }],
    })
  })

  it.each([undefined, 'ปิด'])('localizes the Dialog close button (%s)', (closeLabel) => {
    render(
      <Dialog defaultOpen>
        <DialogContent closeLabel={closeLabel}>
          <DialogTitle>ชื่อ</DialogTitle>
          <DialogDescription>รายละเอียด</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    expect(screen.getByRole('button', { name: closeLabel ?? 'Close' })).toBeTruthy()
  })

  it('localizes Sheet and CommandDialog close buttons', () => {
    const first = render(
      <Sheet defaultOpen>
        <SheetContent closeLabel="ปิดแผง">
          <SheetTitle>แผง</SheetTitle>
          <SheetDescription>รายละเอียด</SheetDescription>
        </SheetContent>
      </Sheet>
    )
    expect(screen.getByRole('button', { name: 'ปิดแผง' })).toBeTruthy()
    first.unmount()
    render(
      <CommandDialog open title="คำสั่ง" description="ค้นหาคำสั่ง" closeLabel="ปิดคำสั่ง">
        <span>เนื้อหา</span>
      </CommandDialog>
    )
    expect(screen.getByRole('button', { name: 'ปิดคำสั่ง' })).toBeTruthy()
  })

  it('localizes the mobile sidebar and restores the opener after repeated Escape closes', async () => {
    render(
      <SidebarProvider>
        <Sidebar
          labels={{
            mobileTitle: 'เมนู',
            mobileDescription: 'เมนูบนมือถือ',
            mobileClose: 'ปิดเมนู',
          }}
        >
          <SidebarTrigger label="ปิดจากในเมนู" />
        </Sidebar>
        <SidebarTrigger label="เปิดเมนู" />
        <SidebarRail label="ยุบเมนู" />
      </SidebarProvider>
    )
    const trigger = screen.getByRole('button', { name: 'เปิดเมนู' })
    expect(screen.getByTitle('ยุบเมนู').getAttribute('aria-label')).toBe('ยุบเมนู')
    for (let index = 0; index < 3; index++) {
      trigger.focus()
      fireEvent.click(trigger)
      expect(await screen.findByRole('dialog', { name: 'เมนู' })).toBeTruthy()
      expect(screen.getByText('เมนูบนมือถือ')).toBeTruthy()
      expect(screen.getByRole('button', { name: 'ปิดเมนู' })).toBeTruthy()
      fireEvent.keyDown(document.activeElement ?? document.body, { key: 'Escape' })
      await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull())
      await waitFor(() => expect(document.activeElement).toBe(trigger))
    }
    fireEvent.click(trigger)
    fireEvent.click(await screen.findByRole('button', { name: 'ปิดจากในเมนู' }))
    await waitFor(() => expect(document.activeElement).toBe(trigger))
  })

  it('localizes both Combobox placeholders and empty state, retaining input overrides', () => {
    const first = render(
      <ComboboxProvider items={[]}>
        <ComboboxTrigger placeholder="เลือกรายการ" />
      </ComboboxProvider>
    )
    expect(screen.getByRole('combobox').textContent).toContain('เลือกรายการ')
    first.unmount()
    render(
      <ComboboxProvider items={[]} multipleItems open>
        <ComboboxTriggerMultiValue placeholder="เลือกหลายรายการ" />
        <ComboboxContent>
          <ComboboxCommandInput placeholder="ค้นหา" />
          <ComboboxCommandList>
            <ComboboxCommandEmpty emptyText="ไม่พบรายการ" />
          </ComboboxCommandList>
        </ComboboxContent>
      </ComboboxProvider>
    )
    expect(screen.getByText('เลือกหลายรายการ')).toBeTruthy()
    expect(screen.getByPlaceholderText('ค้นหา')).toBeTruthy()
    expect(screen.getByText('ไม่พบรายการ')).toBeTruthy()
  })

  it('localizes automatic Select empty content', async () => {
    render(
      <Select defaultOpen>
        <SelectTrigger aria-label="เลือก">
          <SelectValue placeholder="เลือก" />
        </SelectTrigger>
        <SelectContent emptyText="ไม่มีรายการ" />
      </Select>
    )
    expect(await screen.findByText('ไม่มีรายการ')).toBeTruthy()
  })

  it('provides a DatePicker placeholder and keeps custom date formatting', () => {
    const { rerender } = render(
      <DatePickerProvider>
        <DatePickerTrigger placeholder="เลือกวันที่" />
      </DatePickerProvider>
    )
    expect(screen.getByText('เลือกวันที่')).toBeTruthy()
    rerender(
      <DatePickerProvider>
        <DatePickerTrigger
          value={new Date(2026, 0, 2)}
          formatDate={() => 'วันที่ 2 มกราคม'}
          placeholder="เลือกวันที่"
        />
      </DatePickerProvider>
    )
    expect(screen.getByText('วันที่ 2 มกราคม')).toBeTruthy()
  })

  it('passes Calendar labels/locale through, including the month dropdown formatter', () => {
    render(
      <Calendar
        month={new Date(2026, 0, 1)}
        captionLayout="dropdown"
        locale={th}
        labels={{
          labelNext: () => 'เดือนถัดไป',
          labelPrevious: () => 'เดือนก่อน',
          labelMonthDropdown: () => 'เดือน',
          labelYearDropdown: () => 'ปี',
        }}
      />
    )
    expect(screen.getByRole('button', { name: 'เดือนถัดไป' })).toBeTruthy()
    expect(screen.getByRole('button', { name: 'เดือนก่อน' })).toBeTruthy()
    expect(screen.getByRole('option', { name: 'ม.ค.' })).toBeTruthy()
  })

  it('updates translated file status when status or labels change', () => {
    const { rerender } = render(
      <FilePreviewStatus
        status="PENDING"
        labels={{ pending: 'รอ', completed: 'สำเร็จ', failed: 'ล้มเหลว' }}
      />
    )
    expect(screen.getByText('รอ')).toBeTruthy()
    rerender(<FilePreviewStatus status="COMPLETED" labels={{ completed: 'สำเร็จ' }} />)
    expect(screen.getByText('สำเร็จ')).toBeTruthy()
    rerender(<FilePreviewStatus status="FAILED" />)
    expect(screen.getByText('Failed')).toBeTruthy()
    rerender(<FilePreviewStatus status="FAILED" labels={{ failed: 'ล้มเหลว' }} />)
    expect(screen.getByText('ล้มเหลว')).toBeTruthy()
  })

  it('localizes upload actions, instructions and generated constraints', () => {
    const first = render(
      <DropzoneProvider
        src={[]}
        previews={[]}
        accept={{ 'image/png': ['.png'] }}
        maxSize={2048}
        formatCaption={({ maxSize }) => `ขนาดสูงสุด ${maxSize} ไบต์`}
      >
        <DropZoneEmptyUploadButton labels={{ uploadFile: 'อัปโหลดไฟล์' }} />
        <DropZoneEmptyUploadDescription
          labels={{ clickToUpload: 'คลิกเพื่ออัปโหลด', dragAndDrop: 'หรือลากไฟล์มาวาง' }}
        />
        <DropZoneEmptyUploadCaption />
      </DropzoneProvider>
    )
    expect(screen.getByRole('button', { name: 'อัปโหลดไฟล์' })).toBeTruthy()
    expect(screen.getByText('คลิกเพื่ออัปโหลด')).toBeTruthy()
    expect(screen.getByText(/หรือลากไฟล์มาวาง/)).toBeTruthy()
    expect(screen.getByText('ขนาดสูงสุด 2048 ไบต์.')).toBeTruthy()
    first.unmount()
    render(
      <DropzoneProvider src={[]} previews={[]} maxFiles={3}>
        <DropZoneEmptyUploadButton labels={{ uploadFiles: 'อัปโหลดหลายไฟล์' }} />
      </DropzoneProvider>
    )
    expect(screen.getByRole('button', { name: 'อัปโหลดหลายไฟล์' })).toBeTruthy()
  })
  it('keeps the remaining English defaults without translation props', () => {
    render(
      <>
        <CollectionCardItemCount itemNumber={3} />
        <FilePreviewStatus status="PENDING" />
        <ComboboxProvider items={[]} open>
          <ComboboxTrigger />
          <ComboboxContent>
            <ComboboxCommandInput />
            <ComboboxCommandList>
              <ComboboxCommandEmpty />
            </ComboboxCommandList>
          </ComboboxContent>
        </ComboboxProvider>
        <DropzoneProvider
          src={[]}
          previews={[]}
          accept={{ 'image/png': ['.png'] }}
          minSize={1024}
          maxSize={2048}
        >
          <DropZoneEmptyUploadButton />
          <DropZoneEmptyUploadDescription />
          <DropZoneEmptyUploadCaption />
        </DropzoneProvider>
      </>
    )
    for (const text of [
      '3 items',
      'Pending',
      'Please select item',
      'No framework found',
      'Upload a file',
      'Click to upload',
    ])
      expect(screen.getByText(text)).toBeTruthy()
    expect(screen.getByPlaceholderText('Search item...')).toBeTruthy()
    expect(screen.getByText('Accepts image/png between 1.00KB and 2.00KB.')).toBeTruthy()
  })

  it('keeps existing child overrides and hidden close-button behavior', () => {
    const first = render(
      <ComboboxProvider items={[]} open>
        <ComboboxTrigger placeholder="ไม่ใช้">
          <button>เลือกเอง</button>
        </ComboboxTrigger>
        <ComboboxContent>
          <ComboboxCommandList>
            <ComboboxCommandEmpty emptyText="ไม่ใช้">กำหนดเอง</ComboboxCommandEmpty>
          </ComboboxCommandList>
        </ComboboxContent>
      </ComboboxProvider>
    )
    expect(screen.getByText('เลือกเอง')).toBeTruthy()
    expect(screen.getByText('กำหนดเอง')).toBeTruthy()
    expect(screen.queryByText('ไม่ใช้')).toBeNull()
    first.unmount()
    render(
      <Dialog defaultOpen>
        <DialogContent closeLabel="ปิด" showCloseButton={false}>
          <DialogTitle>ชื่อ</DialogTitle>
          <DialogDescription>รายละเอียด</DialogDescription>
        </DialogContent>
      </Dialog>
    )
    expect(screen.queryByRole('button', { name: 'ปิด' })).toBeNull()
  })

  it('keeps an explicit Calendar formatter ahead of the locale default', () => {
    render(
      <Calendar
        month={new Date(2026, 0, 1)}
        captionLayout="dropdown"
        locale={th}
        formatters={{ formatMonthDropdown: (date) => `เดือน ${date.getMonth() + 1}` }}
      />
    )
    expect(screen.getByRole('option', { name: 'เดือน 1' })).toBeTruthy()
  })
})
