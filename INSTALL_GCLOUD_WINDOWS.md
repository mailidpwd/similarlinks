# Install Google Cloud SDK on Windows

The `gcloud` command is not found because Google Cloud SDK is not installed. Follow these steps to install it.

## Option 1: Install via Installer (Recommended)

### Step 1: Download Google Cloud SDK

1. Go to: https://cloud.google.com/sdk/docs/install
2. Click **"Download Google Cloud SDK"**
3. Select **"Windows x86_64 (64-bit)"** or **"Windows x86 (32-bit)"** based on your system
4. Download the installer (`.exe` file)

### Step 2: Run the Installer

1. Double-click the downloaded `.exe` file
2. Follow the installation wizard:
   - Accept the license
   - Choose installation location (default is fine)
   - **IMPORTANT**: Check "Add Cloud SDK to PATH" during installation
3. Click **"Install"**

### Step 3: Restart PowerShell

After installation, **close and reopen PowerShell** for PATH changes to take effect.

### Step 4: Verify Installation

Open a **new** PowerShell window and run:

```powershell
gcloud --version
```

You should see output like:
```
Google Cloud SDK 450.0.0
```

## Option 2: Install via Package Manager (Alternative)

### Using Chocolatey (if you have it):

```powershell
choco install gcloudsdk
```

### Using Scoop (if you have it):

```powershell
scoop install gcloud
```

## Option 3: Manual Installation (Advanced)

If the installer doesn't work:

1. Download the ZIP file from: https://cloud.google.com/sdk/docs/install
2. Extract to `C:\Program Files (x86)\Google\Cloud SDK\`
3. Run the install script:
   ```powershell
   cd "C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk"
   .\install.bat
   ```
4. Add to PATH manually:
   - Open System Properties → Environment Variables
   - Add `C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin` to PATH

## After Installation

### 1. Initialize gcloud

```powershell
gcloud init
```

This will:
- Log you in to Google Cloud
- Set up your default project
- Configure default region

### 2. Or Login Directly

```powershell
gcloud auth login
```

### 3. Set Your Project

```powershell
gcloud config set project YOUR_PROJECT_ID
```

## Troubleshooting

### Issue: "gcloud is not recognized" after installation

**Solution 1**: Restart PowerShell (close and reopen)

**Solution 2**: Add to PATH manually
1. Find where gcloud is installed (usually `C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin`)
2. Add that path to your system PATH:
   - Press `Win + R`, type `sysdm.cpl`, press Enter
   - Go to "Advanced" tab → "Environment Variables"
   - Under "System variables", find "Path" → "Edit"
   - Add the bin folder path
   - Click OK and restart PowerShell

**Solution 3**: Use full path temporarily
```powershell
& "C:\Program Files (x86)\Google\Cloud SDK\google-cloud-sdk\bin\gcloud.exe" --version
```

### Issue: Installation fails

**Solution**: 
- Run PowerShell as Administrator
- Check if you have antivirus blocking the installer
- Try downloading the installer again

### Issue: "Access Denied" errors

**Solution**: Run PowerShell as Administrator

## Quick Test

After installation, test with:

```powershell
# Check version
gcloud --version

# Check if authenticated
gcloud auth list

# Check current project
gcloud config get-value project
```

## Next Steps

Once `gcloud` is installed and working:

1. ✅ Authenticate: `gcloud auth login`
2. ✅ Set project: `gcloud config set project YOUR_PROJECT_ID`
3. ✅ Enable APIs: `gcloud services enable run.googleapis.com firestore.googleapis.com`
4. ✅ Deploy: Follow `backend/DEPLOYMENT.md`

---

**Download Link**: https://cloud.google.com/sdk/docs/install

**Need help?** Check the official docs: https://cloud.google.com/sdk/docs/install-sdk


