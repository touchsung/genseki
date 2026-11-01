'use client'

import React, { useState } from 'react'
import { th } from 'react-day-picker/locale'

import {
  Breadcrumb,
  BreadcrumbEllipsis,
  Button,
  Calendar,
  CollectionCardItemCount,
  ComboboxCommandEmpty,
  ComboboxCommandInput,
  ComboboxCommandList,
  ComboboxContent,
  ComboboxProvider,
  ComboboxTrigger,
  DatePickerContent,
  DatePickerProvider,
  DatePickerTrigger,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DropZoneEmptyUploadButton,
  DropZoneEmptyUploadCaption,
  DropZoneEmptyUploadDescription,
  DropzoneProvider,
  FilePreviewStatus,
  Filter,
  type FilterOptions,
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
  SheetTrigger,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  Typography,
} from '@genseki/ui'

export default function LocalizationPage() {
  const [thai, setThai] = useState(true)
  const [day, setDay] = useState<Date>()
  const [filters, setFilters] = useState<FilterOptions>({
    สถานะ: [{ value: 'open', label: 'เปิด', isSelected: true }],
    ผู้รับผิดชอบ: [{ value: 'me', label: 'ฉัน' }],
  })
  const closeLabel = thai ? 'ปิด' : undefined

  return (
    <SidebarProvider>
      <Sidebar
        collapsible="icon"
        labels={
          thai
            ? { mobileTitle: 'เมนู', mobileDescription: 'เมนูบนมือถือ', mobileClose: 'ปิดเมนู' }
            : undefined
        }
      >
        <SidebarHeader>
          <Typography>{thai ? 'เมนูตัวอย่าง' : 'Example menu'}</Typography>
        </SidebarHeader>
        <SidebarContent>
          <SidebarTrigger label={thai ? 'ปิดเมนู' : undefined} />
        </SidebarContent>
        <SidebarRail label={thai ? 'ยุบหรือขยายเมนู' : undefined} />
      </Sidebar>
      <main className="flex-1 min-w-0 p-8 flex flex-col gap-8">
        <header className="flex flex-wrap gap-4 items-center">
          <SidebarTrigger label={thai ? 'เปิดเมนู' : undefined} />
          <Typography type="h2">{thai ? 'ข้อความภาษาไทย' : 'English defaults'}</Typography>
          <Button variant="outline" onClick={() => setThai((value) => !value)}>
            {thai ? 'English' : 'ไทย'}
          </Button>
        </header>
        <Typography>
          {thai
            ? 'ย่อหน้าจอเป็น 390px เพื่อทดสอบตัวกรองและการคืนโฟกัสหลังปิดเมนู'
            : 'Use a 390px viewport to check filter bounds and sidebar focus restoration.'}
        </Typography>
        <Filter
          options={filters}
          onChange={setFilters}
          labels={
            thai
              ? {
                  trigger: 'ตัวกรอง',
                  title: 'เลือกตัวกรอง',
                  resetAll: 'ล้างทั้งหมด',
                  apply: 'ใช้ตัวกรอง',
                }
              : undefined
          }
        />
        <div className="flex flex-wrap gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>{thai ? 'เปิดกล่องข้อความ' : 'Open dialog'}</Button>
            </DialogTrigger>
            <DialogContent closeLabel={closeLabel}>
              <DialogTitle>{thai ? 'ชื่อเรื่อง' : 'Title'}</DialogTitle>
              <DialogDescription>{thai ? 'รายละเอียด' : 'Description'}</DialogDescription>
            </DialogContent>
          </Dialog>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline">{thai ? 'เปิดแผง' : 'Open sheet'}</Button>
            </SheetTrigger>
            <SheetContent closeLabel={closeLabel}>
              <SheetTitle>{thai ? 'รายละเอียด' : 'Details'}</SheetTitle>
              <SheetDescription>{thai ? 'ตัวอย่างแผงด้านข้าง' : 'Example sheet'}</SheetDescription>
            </SheetContent>
          </Sheet>
        </div>
        <Pagination
          aria-label={thai ? 'เลือกหน้า' : 'pagination'}
          className="flex flex-wrap items-center gap-4"
        >
          <PaginationPrevious aria-label={thai ? 'หน้าก่อน' : 'Go to previous page'} />
          <PaginationEllipsis label={thai ? 'หน้าเพิ่มเติม' : undefined} />
          <PaginationNext aria-label={thai ? 'หน้าถัดไป' : 'Go to next page'} />
          <PageIndex
            page={2}
            totalPage={5}
            labels={thai ? { page: 'หน้า', of: 'จาก' } : undefined}
          />
          <PageSizeSelect label={thai ? 'แสดง' : undefined} />
        </Pagination>
        <Breadcrumb aria-label={thai ? 'เส้นทาง' : 'breadcrumb'}>
          <BreadcrumbEllipsis label={thai ? 'เพิ่มเติม' : undefined} />
        </Breadcrumb>
        <div className="flex flex-wrap gap-4">
          <DatePickerProvider>
            <DatePickerTrigger
              value={day}
              placeholder={thai ? 'เลือกวันที่' : undefined}
              formatDate={(date) => date?.toLocaleDateString(thai ? 'th-TH' : 'en-US')}
            />
            <DatePickerContent>
              <Calendar
                mode="single"
                selected={day}
                onSelect={setDay}
                locale={thai ? th : undefined}
                labels={
                  thai
                    ? {
                        labelNext: () => 'เดือนถัดไป',
                        labelPrevious: () => 'เดือนก่อน',
                        labelDayButton: (date) =>
                          date.toLocaleDateString('th-TH', { dateStyle: 'full' }),
                        labelWeekday: (date) =>
                          date.toLocaleDateString('th-TH', { weekday: 'long' }),
                      }
                    : undefined
                }
              />
            </DatePickerContent>
          </DatePickerProvider>
          <Select>
            <SelectTrigger aria-label={thai ? 'ตัวเลือก' : 'Options'}>
              <SelectValue placeholder={thai ? 'เลือก' : 'Select'} />
            </SelectTrigger>
            <SelectContent emptyText={thai ? 'ไม่มีรายการ' : undefined} />
          </Select>
          <ComboboxProvider items={[]}>
            <ComboboxTrigger placeholder={thai ? 'เลือกรายการ' : undefined} />
            <ComboboxContent>
              <ComboboxCommandInput placeholder={thai ? 'ค้นหา' : 'Search item...'} />
              <ComboboxCommandList>
                <ComboboxCommandEmpty emptyText={thai ? 'ไม่พบรายการ' : undefined} />
              </ComboboxCommandList>
            </ComboboxContent>
          </ComboboxProvider>
        </div>
        <CollectionCardItemCount itemNumber={3} itemLabel={thai ? 'รายการ' : undefined} />
        <FilePreviewStatus
          status="COMPLETED"
          labels={
            thai ? { pending: 'รอดำเนินการ', completed: 'เสร็จสิ้น', failed: 'ล้มเหลว' } : undefined
          }
        />
        <DropzoneProvider
          src={[]}
          previews={[]}
          accept={{ 'image/png': ['.png'] }}
          maxSize={2 * 1024 * 1024}
          formatCaption={
            thai
              ? ({ maxSize }) => `รองรับ PNG ขนาดไม่เกิน ${(maxSize ?? 0) / 1024 / 1024} เมกะไบต์`
              : undefined
          }
        >
          <div className="flex flex-col gap-4">
            <DropZoneEmptyUploadButton
              labels={
                thai ? { uploadFile: 'อัปโหลดไฟล์', uploadFiles: 'อัปโหลดหลายไฟล์' } : undefined
              }
            />
            <DropZoneEmptyUploadDescription
              labels={
                thai
                  ? {
                      clickToUpload: 'คลิกเพื่ออัปโหลด',
                      dragAndDrop: 'หรือลากไฟล์ PNG มาวาง (สูงสุด 2 เมกะไบต์)',
                    }
                  : undefined
              }
            />
            <DropZoneEmptyUploadCaption />
          </div>
        </DropzoneProvider>
      </main>
    </SidebarProvider>
  )
}
