import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { Employee } from '../../modules/employees/core/entities/Employee';

export const PdfService = {
  generateEmployeePDF(employee: Employee): void {
    const doc = new jsPDF();

    // Información del empleado
    doc.setFontSize(16);
    doc.text("Employee Information", 14, 20);
    
    doc.setFontSize(12);
    doc.text(`ID: ${employee.id}`, 14, 30);
    doc.text(`Document: ${employee.document}`, 14, 40);
    doc.text(`Name: ${employee.first_name} ${employee.last_name}`, 14, 50);
    doc.text(`Department: ${employee.department}`, 14, 60);
    doc.text(`Access: ${employee.access ? 'Granted' : 'Denied'}`, 14, 70);

    // Preparar la tabla con los ingresos
    const entries = employee.entries || [];
    const tableColumns = ["ID", "Entry Time", "Successful"];
    const tableRows = entries.map(entry => [
      entry.id,
      entry.entry_time,
      entry.was_successful ? "Yes" : "No"
    ]);

    autoTable(doc, {
      head: [tableColumns],
      body: tableRows,
      startY: 80,
      margin: { left: 14 },
    });

    // Guardar el PDF con un nombre dinámico
    doc.save(`employee_${employee.id}.pdf`);
  }
};
