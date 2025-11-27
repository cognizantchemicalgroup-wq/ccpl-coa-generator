# COA Generator - CCPL

Certificate of Analysis Generator for Cognizant Chemical Pvt. Ltd.

## Overview

This is a web-based COA (Certificate of Analysis) Generator system with user authentication, product management via JSON files, and responsive design for both mobile and desktop devices.

## Features

- **Secure Login System** with 5 user accounts
- **Raw Material Testing** (3 products with dropdown selection)
- **Finish Goods Testing** (11 products with search functionality)
- **Auto-calculation** of expiry date (3 years from manufacturing date)
- **Real-time validation** of test results against specifications
- **PDF Generation** of COA reports
- **Responsive Design** - works on mobile and desktop
- **JSON-based product database** - easy to add/modify products

## Login Credentials

The system has 5 pre-configured users:

| Username | Password | Role | Name |
|----------|----------|------|------|
| admin | ccpl@2024 | Administrator | Administrator |
| qc_manager | qcmanager123 | Manager | QC Manager |
| qc_analyst1 | analyst001 | Analyst | QC Analyst 1 |
| qc_analyst2 | analyst002 | Analyst | QC Analyst 2 |
| lab_tech | labtech2024 | Technician | Lab Technician |

## File Structure

```
COA GENERATOR 17 NOV/
├── login.html              # Login page (entry point)
├── index.html              # Main COA generator application
├── data/
│   ├── users.json          # User credentials
│   ├── rm-products.json    # Raw Material products (3 products)
│   └── fg-products.json    # Finish Goods products (11 products)
├── RM/                     # Raw material test data (reference)
│   ├── RM2506001_Methanol.doc
│   ├── RM2506002_Methylene Chloride.doc
│   └── RM2506004_Acetone.doc
└── FG/                     # Finish goods test data (reference)
    └── (11 .docx files)
```

## Product Database

### Raw Materials (3 Products)
- **RM2506001** - Methanol (CH3OH)
- **RM2506002** - Methylene Chloride (CH2Cl2)
- **RM2506004** - Acetone ((CH3)2CO)

### Finished Goods (11 Products)
- **F2504001** - Acetone EP/BP
- **F2504001M** - Acetone Multi (NF/EP/BP)
- **F2508003** - Acetone NF
- **F2506002** - MDC NF
- **F2507002** - MDC EP/BP
- **F2506002M** - MDC Multi (NF/EP/BP)
- **F2509003** - Methanol NF
- **F2510002** - Methanol ND (Normal Duty)
- **RM2509004** - Methanol HPLC
- **RM2509007** - Methanol EP/BP
- **RM2509007M** - Methanol Multi (NF/EP/BP)

## How to Use

### 1. Starting the Application

1. Open `login.html` in a web browser
2. Enter one of the login credentials from the table above
3. Click "Login"

### 2. Generating a COA

1. **Select Test Type**
   - Choose "Raw Material Test" or "Finish Goods Test"

2. **For Raw Material:**
   - Select chemical from dropdown (3 options)
   - Enter batch number
   - Select manufacturing date
   - Expiry date auto-calculates (3 years from mfg date)

3. **For Finish Goods:**
   - Type product code or name in search box
   - Select from dropdown results
   - Enter batch number
   - Select manufacturing date
   - Expiry date auto-calculates (3 years from mfg date)

4. **Enter Test Results**
   - For qualitative tests: Select "Complies" or "Passes test" from dropdown
   - For quantitative tests: Enter numeric values
   - System validates in real-time:
     - ✅ Green = Within specification
     - ❌ Red = Out of specification

5. **Download PDF**
   - Button is enabled only when all tests pass
   - PDF generates with company branding and test results

### 3. Validation Rules

- **Compliance Tests**: Must select "Complies" or "Passes test"
- **Numeric Tests**:
  - Must be within specified range (NLT = Not Less Than, NMT = Not More Than)
  - Can enter "Not Detected" for detectable impurities
  - Red highlighting indicates out-of-spec values
- **PDF Generation**: Only allowed when ALL tests are within specification

## Adding New Products

### To Add Raw Material Products:

Edit `data/rm-products.json`:

```json
{
  "code": "RM2506005",
  "name": "New Chemical",
  "chemicalName": "New Chemical (Formula)",
  "category": "raw-material",
  "tests": [
    {
      "test": "Test Name",
      "specification": "Test specification",
      "type": "compliance",  // or "numeric"
      "required": "Complies"  // for compliance type
    },
    {
      "test": "Numeric Test",
      "specification": "NLT 99.0%",
      "type": "numeric",
      "range": { "min": 99.0 },
      "unit": "%"
    }
  ]
}
```

### To Add Finish Goods Products:

Edit `data/fg-products.json` following the same pattern.

### Test Types:

1. **Header** - Section heading (no input)
```json
{
  "test": "Section Name",
  "specification": "",
  "type": "header"
}
```

2. **Compliance** - Pass/Fail tests
```json
{
  "test": "Appearance",
  "specification": "Clear, colorless liquid",
  "type": "compliance",
  "required": "Complies"
}
```

3. **Numeric** - Quantitative tests
```json
{
  "test": "Assay",
  "specification": "NLT 99.5%",
  "type": "numeric",
  "range": { "min": 99.5, "max": 99.9 },
  "unit": "%",
  "detectable": "Not Detected"  // optional
}
```

## Adding/Modifying Users

Edit `data/users.json` or modify directly in the login page (uses localStorage):

```json
{
  "id": 6,
  "username": "new_user",
  "password": "password123",
  "name": "New User Name",
  "role": "role_name"
}
```

## Deployment to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy:**
   ```bash
   cd "/Users/rupimac/Downloads/COA GENERATOR 17 NOV"
   vercel
   ```

4. **Follow the prompts:**
   - Set up and deploy: Yes
   - Scope: Your account
   - Link to existing project: No
   - Project name: coa-generator-ccpl
   - Directory: ./
   - Override settings: No

5. **Production deployment:**
   ```bash
   vercel --prod
   ```

### Vercel Configuration

Create `vercel.json` in the root directory:

```json
{
  "version": 2,
  "routes": [
    {
      "src": "/",
      "dest": "/login.html"
    },
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ]
}
```

## Browser Compatibility

- ✅ Chrome (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Design Breakpoints

- **Desktop**: > 768px
- **Tablet**: 481px - 768px
- **Mobile**: < 480px

## Technical Details

### Technologies Used:
- Pure HTML5, CSS3, JavaScript (no frameworks)
- jsPDF library for PDF generation
- LocalStorage for user authentication
- Fetch API for JSON data loading
- CSS Grid and Flexbox for responsive layouts

### Data Storage:
- **Client-side**: SessionStorage (user session)
- **Client-side**: LocalStorage (user credentials)
- **Static files**: JSON files for product data

### Security Notes:
- This is a **client-side only** application
- User authentication is basic (suitable for internal use)
- For production use, implement server-side authentication
- Passwords are stored in plain text (for demo purposes only)

## Troubleshooting

### Login not working:
- Clear browser cache and localStorage
- Refresh the page
- Check browser console for errors

### Products not loading:
- Ensure JSON files are in the `data/` folder
- Check browser console for fetch errors
- Verify JSON syntax is valid

### PDF not generating:
- Ensure all test results are entered
- Check that all values are within specification
- Verify jsPDF library is loaded

### Mobile display issues:
- Ensure viewport meta tag is present
- Test in device mode in browser DevTools
- Clear mobile browser cache

## Support

For issues or questions:
- Check browser console for errors
- Verify JSON file syntax
- Ensure all files are in correct locations

## Future Enhancements

Potential features to add:
- Server-side authentication
- Database integration
- Batch history tracking
- Export to Excel
- Email COA reports
- Digital signatures
- Audit trail
- Multi-language support

## License

© 2024 Cognizant Chemical Pvt. Ltd. All rights reserved.

---

**Last Updated:** November 17, 2024
**Version:** 1.0
**Developed for:** CCPL Quality Control Department
