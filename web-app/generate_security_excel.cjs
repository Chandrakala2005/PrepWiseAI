const ExcelJS = require('exceljs');
const path = require('path');

async function generateSecurityReports() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'Security Automation';
  workbook.created = new Date();

  // ===========================
  // SHEET 1: Security Findings
  // ===========================
  const findingsSheet = workbook.addWorksheet('Security Findings', { properties: { tabColor: { argb: 'FF0000' } } });
  findingsSheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Severity', key: 'severity', width: 15 },
    { header: 'Vulnerability Type', key: 'type', width: 25 },
    { header: 'Endpoint/Path', key: 'endpoint', width: 40 },
    { header: 'Description', key: 'description', width: 60 },
    { header: 'Recommended Fix', key: 'fix', width: 60 }
  ];
  
  findingsSheet.getRow(1).font = { bold: true };
  findingsSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DDDDDD' } };

  findingsSheet.addRows([
    { id: 'VULN-001', severity: 'Critical', type: 'SQL Injection', endpoint: 'POST /api/auth/login', description: 'String concatenation used in database queries allows for malicious payload execution.', fix: 'Use parameterized queries.' },
    { id: 'VULN-002', severity: 'High', type: 'Hardcoded Secret', endpoint: 'middleware/auth.cjs', description: 'JWT Secret hardcoded as fallback in source code.', fix: 'Remove fallback; throw fatal error if JWT_SECRET is unset.' },
    { id: 'VULN-003', severity: 'Medium', type: 'Input Validation', endpoint: 'POST /api/auth/register', description: 'Missing robust validation/sanitization for email and password fields.', fix: 'Implement express-validator middleware.' },
    { id: 'VULN-004', severity: 'Low', type: 'Rate Limiting', endpoint: 'Global', description: 'No rate limiting protection on API routes.', fix: 'Install and configure express-rate-limit.' }
  ]);

  // ===========================
  // SHEET 2: Endpoint Inventory
  // ===========================
  const endpointSheet = workbook.addWorksheet('Endpoint Inventory', { properties: { tabColor: { argb: '0000FF' } } });
  endpointSheet.columns = [
    { header: 'Endpoint', key: 'endpoint', width: 30 },
    { header: 'HTTP Method', key: 'method', width: 15 },
    { header: 'Auth Required', key: 'auth', width: 15 },
    { header: 'File Path', key: 'file', width: 40 }
  ];
  
  endpointSheet.getRow(1).font = { bold: true };
  endpointSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DDDDDD' } };

  endpointSheet.addRows([
    { endpoint: '/api/auth/login', method: 'POST', auth: 'No', file: 'routes/auth.cjs' },
    { endpoint: '/api/auth/register', method: 'POST', auth: 'No', file: 'routes/auth.cjs' },
    { endpoint: '/api/auth/otp/send', method: 'POST', auth: 'No', file: 'routes/auth.cjs' },
    { endpoint: '/api/auth/otp/verify', method: 'POST', auth: 'No', file: 'routes/auth.cjs' },
    { endpoint: '/api/auth/social', method: 'POST', auth: 'No', file: 'routes/auth.cjs' },
    { endpoint: '/api/auth/persona', method: 'POST', auth: 'No', file: 'routes/auth.cjs' },
    { endpoint: '/api/user/profile', method: 'GET', auth: 'Yes', file: 'routes/user.cjs' },
    { endpoint: '/api/user/profile', method: 'PUT', auth: 'Yes', file: 'routes/user.cjs' },
    { endpoint: '/api/interviews', method: 'GET', auth: 'Yes', file: 'routes/interviews.cjs' },
    { endpoint: '/api/interviews', method: 'POST', auth: 'Yes', file: 'routes/interviews.cjs' },
    { endpoint: '/api/analytics/summary', method: 'GET', auth: 'Yes', file: 'routes/interviews.cjs' },
    { endpoint: '/api/health', method: 'GET', auth: 'No', file: 'server.cjs' }
  ]);

  // ===========================
  // SHEET 3: Dependency Vulnerabilities
  // ===========================
  const depSheet = workbook.addWorksheet('Dependency Vulnerabilities', { properties: { tabColor: { argb: 'FFA500' } } });
  depSheet.columns = [
    { header: 'Package', key: 'package', width: 25 },
    { header: 'Severity', key: 'severity', width: 15 },
    { header: 'Description', key: 'description', width: 60 }
  ];
  
  depSheet.getRow(1).font = { bold: true };
  depSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DDDDDD' } };

  depSheet.addRows([
    { package: 'Multiple via npm audit', severity: 'High', description: '2 High severity vulnerabilities discovered in dependency tree.' }
  ]);

  // ===========================
  // SHEET 4: Risk Summary
  // ===========================
  const riskSheet = workbook.addWorksheet('Risk Summary', { properties: { tabColor: { argb: '00FF00' } } });
  riskSheet.columns = [
    { header: 'Risk Category', key: 'category', width: 25 },
    { header: 'Count', key: 'count', width: 10 }
  ];
  
  riskSheet.getRow(1).font = { bold: true };
  riskSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DDDDDD' } };

  riskSheet.addRows([
    { category: 'Critical', count: 1 },
    { category: 'High', count: 2 },
    { category: 'Medium', count: 1 },
    { category: 'Low', count: 1 },
    { category: 'Total Findings', count: 5 }
  ]);

  // SAVE
  const findingsPath = path.join(__dirname, '..', 'Vulnerability Test Results', 'findings.xlsx');
  const endpointPath = path.join(__dirname, '..', 'Vulnerability Test Results', 'endpoint-inventory.xlsx');

  try {
    await workbook.xlsx.writeFile(findingsPath);
    console.log(`✅ Generated: ${findingsPath}`);
    
    // Create separate endpoint workbook
    const epWorkbook = new ExcelJS.Workbook();
    const epSheet = epWorkbook.addWorksheet('Endpoint Inventory');
    epSheet.columns = endpointSheet.columns;
    epSheet.getRow(1).font = { bold: true };
    epSheet.getRow(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'DDDDDD' } };
    endpointSheet.eachRow((row, rowNumber) => {
        if(rowNumber > 1) epSheet.addRow(row.values);
    });
    
    await epWorkbook.xlsx.writeFile(endpointPath);
    console.log(`✅ Generated: ${endpointPath}`);
  } catch (err) {
    console.error('❌ Error saving Excel:', err);
  }
}

generateSecurityReports();
