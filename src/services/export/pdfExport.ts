/**
 * PDF Export Service
 * Generate professional PDF reports using jsPDF
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { TransportModuleResults } from '../../types/transport.types';
import { formatCO2Large, formatDate, formatVehicleType, formatFuelType } from '../../utils/formatters';

export function exportTransportToPDF(data: TransportModuleResults, productionName?: string) {
  const doc = new jsPDF();

  const pageWidth = doc.internal.pageSize.getWidth();
  let yPosition = 20;

  // Title
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('Carbon Emissions Report', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 10;
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text('Transport Module', pageWidth / 2, yPosition, { align: 'center' });

  yPosition += 15;

  // Production Info
  if (productionName) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Production: ${productionName}`, 20, yPosition);
    yPosition += 7;
  }

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Report Generated: ${formatDate(new Date(), 'MMM d, yyyy h:mm a')}`, 20, yPosition);
  yPosition += 5;
  doc.text(`Emission Factors Version: ${data.metadata.emissionFactorsVersion}`, 20, yPosition);
  yPosition += 5;
  doc.text(`Source: ${data.metadata.source}`, 20, yPosition);
  yPosition += 15;

  // Summary Section
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Emissions Summary', 20, yPosition);
  yPosition += 10;

  // Total emissions box
  doc.setFillColor(34, 197, 94); // Green
  doc.roundedRect(20, yPosition, pageWidth - 40, 20, 3, 3, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.text('Total Transport Emissions', pageWidth / 2, yPosition + 8, { align: 'center' });
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCO2Large(data.totals.totalCO2e), pageWidth / 2, yPosition + 16, { align: 'center' });

  doc.setTextColor(0, 0, 0);
  yPosition += 30;

  // Breakdown by mode
  const summaryData = [
    ['Transport Mode', 'Entries', 'CO₂ Emissions'],
    ['Road Vehicles', `${data.entries.filter(e => e.mode === 'road').length}`, formatCO2Large(data.totals.byMode.road)],
    ['Air Travel', `${data.entries.filter(e => e.mode === 'air').length}`, formatCO2Large(data.totals.byMode.air)],
    ['Rail Travel', `${data.entries.filter(e => e.mode === 'rail').length}`, formatCO2Large(data.totals.byMode.rail)]
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [summaryData[0]],
    body: summaryData.slice(1),
    theme: 'grid',
    headStyles: { fillColor: [59, 130, 246] }, // Blue
    margin: { left: 20, right: 20 }
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Detailed Entries
  if (data.entries.length > 0) {
    // Check if we need a new page
    if (yPosition > 200) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Detailed Entries', 20, yPosition);
    yPosition += 10;

    // Prepare detailed entries table
    const detailedData: any[] = [
      ['Date', 'Type', 'Description', 'Details', 'CO₂ (kg)']
    ];

    data.entries.forEach((entry, index) => {
      const result = data.results[index];
      let details = '';

      if (entry.mode === 'road') {
        details = `${formatVehicleType(entry.vehicleType)} (${formatFuelType(entry.fuelType)}) - ${entry.distance} ${entry.distanceUnit}`;
      } else if (entry.mode === 'air') {
        details = `${entry.origin} → ${entry.destination} (${entry.flightClass})${entry.returnTrip ? ' RT' : ''}`;
      } else if (entry.mode === 'rail') {
        details = `${entry.railType} - ${entry.distance} ${entry.distanceUnit}`;
      }

      detailedData.push([
        formatDate(entry.date, 'MMM d'),
        entry.mode === 'road' ? 'Road' : entry.mode === 'air' ? 'Air' : 'Rail',
        entry.description || '-',
        details,
        result.co2e.toFixed(2)
      ]);
    });

    autoTable(doc, {
      startY: yPosition,
      head: [detailedData[0]],
      body: detailedData.slice(1),
      theme: 'striped',
      headStyles: { fillColor: [59, 130, 246] },
      margin: { left: 20, right: 20 },
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 15 },
        2: { cellWidth: 40 },
        3: { cellWidth: 70 },
        4: { cellWidth: 25, halign: 'right' }
      }
    });
  }

  // Footer on last page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
    doc.text(
      'Generated with Carbon Calculator for Film & TV Production',
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 6,
      { align: 'center' }
    );
  }

  // Save the PDF
  const fileName = `transport-emissions-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
