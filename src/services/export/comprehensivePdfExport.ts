/**
 * Comprehensive PDF Export Service
 * Generate detailed production-wide carbon reports
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCO2Large, formatDate } from '../../utils/formatters';

interface ModuleData {
  name: string;
  totalCO2e: number;
  entries: number;
  icon?: string;
}

interface ProductionData {
  productionName?: string;
  productionType?: string;
  country?: string;
  totalShootDays?: number;
  startDate?: Date;
  endDate?: Date;
}

interface ComprehensiveReportData {
  production: ProductionData;
  modules: ModuleData[];
  totalEmissions: number;
  generatedAt: Date;
}

export function exportComprehensivePDF(data: ComprehensiveReportData) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 20;

  // ===== Cover Page =====
  // Title
  doc.setFillColor(34, 197, 94); // Green
  doc.rect(0, 0, pageWidth, 60, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('PRODUCTION CARBON', pageWidth / 2, 25, { align: 'center' });
  doc.text('FOOTPRINT REPORT', pageWidth / 2, 38, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(formatDate(data.generatedAt, 'MMMM d, yyyy'), pageWidth / 2, 50, { align: 'center' });

  yPosition = 80;
  doc.setTextColor(0, 0, 0);

  // Production Info Box
  doc.setFillColor(240, 240, 240);
  doc.roundedRect(30, yPosition, pageWidth - 60, 60, 5, 5, 'F');

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Production Information', pageWidth / 2, yPosition + 12, { align: 'center' });

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  yPosition += 22;

  if (data.production.productionName) {
    doc.setFont('helvetica', 'bold');
    doc.text('Production:', 40, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(data.production.productionName, 90, yPosition);
    yPosition += 7;
  }

  if (data.production.productionType) {
    doc.setFont('helvetica', 'bold');
    doc.text('Type:', 40, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(data.production.productionType, 90, yPosition);
    yPosition += 7;
  }

  if (data.production.country) {
    doc.setFont('helvetica', 'bold');
    doc.text('Country:', 40, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(data.production.country, 90, yPosition);
    yPosition += 7;
  }

  if (data.production.totalShootDays) {
    doc.setFont('helvetica', 'bold');
    doc.text('Shoot Days:', 40, yPosition);
    doc.setFont('helvetica', 'normal');
    doc.text(data.production.totalShootDays.toString(), 90, yPosition);
  }

  // Total Emissions Hero Section
  yPosition = 160;
  doc.setFillColor(16, 185, 129); // Emerald
  doc.roundedRect(20, yPosition, pageWidth - 40, 45, 5, 5, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('TOTAL CARBON FOOTPRINT', pageWidth / 2, yPosition + 12, { align: 'center' });

  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCO2Large(data.totalEmissions, false), pageWidth / 2, yPosition + 28, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text(data.totalEmissions >= 1000 ? 'tonnes CO₂e' : 'kg CO₂e', pageWidth / 2, yPosition + 38, { align: 'center' });

  // Per day calculation
  if (data.production.totalShootDays && data.production.totalShootDays > 0) {
    yPosition += 55;
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(11);
    const perDay = data.totalEmissions / data.production.totalShootDays;
    doc.text(
      `Average: ${formatCO2Large(perDay, false)} ${perDay >= 1000 ? 'tonnes' : 'kg'} CO₂e per shoot day`,
      pageWidth / 2,
      yPosition,
      { align: 'center' }
    );
  }

  // ===== Page 2: Executive Summary =====
  doc.addPage();
  yPosition = 20;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Executive Summary', 20, yPosition);
  yPosition += 15;

  // Module breakdown table
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.text('Emissions by Category', 20, yPosition);
  yPosition += 8;

  const modulesWithEmissions = data.modules.filter(m => m.totalCO2e > 0);
  const tableData: any[] = [['Category', 'Entries', 'CO₂ Emissions (kg)', 'Percentage']];

  modulesWithEmissions.forEach(module => {
    const percentage = ((module.totalCO2e / data.totalEmissions) * 100).toFixed(1);
    tableData.push([
      module.name,
      module.entries.toString(),
      formatCO2Large(module.totalCO2e, false),
      `${percentage}%`
    ]);
  });

  // Add total row
  tableData.push([
    'TOTAL',
    data.modules.reduce((sum, m) => sum + m.entries, 0).toString(),
    formatCO2Large(data.totalEmissions, false),
    '100.0%'
  ]);

  autoTable(doc, {
    startY: yPosition,
    head: [tableData[0]],
    body: tableData.slice(1),
    theme: 'grid',
    headStyles: {
      fillColor: [34, 197, 94],
      fontSize: 10,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9
    },
    columnStyles: {
      2: { halign: 'right' },
      3: { halign: 'right' }
    },
    margin: { left: 20, right: 20 },
    foot: [[{
      content: '',
      colSpan: 4,
      styles: { fillColor: [240, 240, 240] }
    }]]
  });

  yPosition = (doc as any).lastAutoTable.finalY + 20;

  // Key Insights
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Key Insights', 20, yPosition);
  yPosition += 10;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  if (modulesWithEmissions.length > 0) {
    const topModule = modulesWithEmissions[0];
    const topPercentage = ((topModule.totalCO2e / data.totalEmissions) * 100).toFixed(1);

    const insights = [
      `• ${topModule.name} is the largest contributor at ${topPercentage}% of total emissions`,
      `• Total of ${data.modules.reduce((sum, m) => sum + m.entries, 0)} entries across ${modulesWithEmissions.length} categories`,
      `• Report generated using DEFRA 2023 emission factors`
    ];

    if (data.production.totalShootDays && data.production.totalShootDays > 0) {
      const perDay = data.totalEmissions / data.production.totalShootDays;
      insights.push(
        `• Average daily footprint: ${formatCO2Large(perDay, false)} ${perDay >= 1000 ? 'tonnes' : 'kg'} CO₂e`
      );
    }

    insights.forEach(insight => {
      doc.text(insight, 25, yPosition);
      yPosition += 7;
    });
  }

  // ===== Page 3: Recommendations =====
  doc.addPage();
  yPosition = 20;

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Recommendations', 20, yPosition);
  yPosition += 15;

  doc.setFillColor(219, 234, 254); // Light blue
  doc.roundedRect(20, yPosition, pageWidth - 40, 10, 3, 3, 'F');
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Ways to Reduce Your Carbon Footprint', 25, yPosition + 7);
  yPosition += 18;

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');

  const recommendations = [
    {
      title: 'Transportation',
      tips: [
        'Use electric or hybrid vehicles when possible',
        'Consolidate trips and optimize routing',
        'Encourage carpooling and crew shuttles',
        'Choose rail over air travel for shorter distances'
      ]
    },
    {
      title: 'Energy & Utilities',
      tips: [
        'Use renewable energy sources or green electricity tariffs',
        'Implement energy-efficient lighting (LED)',
        'Turn off equipment when not in use',
        'Use generators efficiently and maintain them properly'
      ]
    },
    {
      title: 'Accommodation',
      tips: [
        'Choose hotels with environmental certifications',
        'House crew locally to reduce travel',
        'Encourage shorter stays when practical'
      ]
    },
    {
      title: 'General Practices',
      tips: [
        'Track and monitor emissions regularly',
        'Set reduction targets for future productions',
        'Offset remaining emissions through certified programs',
        'Share best practices with your team'
      ]
    }
  ];

  recommendations.forEach(section => {
    if (yPosition > pageHeight - 50) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFont('helvetica', 'bold');
    doc.text(section.title, 25, yPosition);
    yPosition += 7;

    doc.setFont('helvetica', 'normal');
    section.tips.forEach(tip => {
      if (yPosition > pageHeight - 20) {
        doc.addPage();
        yPosition = 20;
      }
      doc.text(`  • ${tip}`, 30, yPosition);
      yPosition += 6;
    });

    yPosition += 5;
  });

  // ===== Footer on all pages =====
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${pageCount}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(
      'Generated with Carbon Calculator for Film & TV Production',
      pageWidth / 2,
      pageHeight - 6,
      { align: 'center' }
    );
  }

  // Save the PDF
  const fileName = `carbon-footprint-report-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
