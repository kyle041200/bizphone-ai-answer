# Complete backup reconstruction

The complete ZIP is split only when needed to keep each GitHub file below 95 MB.
Download every part into one directory. Do not open individual parts as ZIPs.

macOS/Linux:

```sh
cat KGHQ-Lovable-Importer-Complete.zip.part* > KGHQ-Lovable-Importer-Complete.zip
shasum -a 256 KGHQ-Lovable-Importer-Complete.zip
```

Windows Command Prompt (use the actual part count shown in the folder):

```bat
copy /b KGHQ-Lovable-Importer-Complete.zip.part001+KGHQ-Lovable-Importer-Complete.zip.part002+KGHQ-Lovable-Importer-Complete.zip.part003+KGHQ-Lovable-Importer-Complete.zip.part004 KGHQ-Lovable-Importer-Complete.zip
```

Or PowerShell for any part count:

```powershell
$output = [IO.File]::Create("KGHQ-Lovable-Importer-Complete.zip")
try {
  Get-ChildItem "KGHQ-Lovable-Importer-Complete.zip.part*" | Sort-Object Name | ForEach-Object {
    $inputFile = [IO.File]::OpenRead($_.FullName)
    try { $inputFile.CopyTo($output) } finally { $inputFile.Dispose() }
  }
} finally { $output.Dispose() }
Get-FileHash "KGHQ-Lovable-Importer-Complete.zip" -Algorithm SHA256
```

If a single complete ZIP is present, no reconstruction is necessary. The standalone
WordPress plugin ZIPs and bundle ZIPs never require reconstruction. The backup
contains nested evidence ZIPs; unzip the desired visual archive to open its HTML
gallery locally. Actual credentials and dependencies are intentionally excluded.

Complete ZIP SHA256: `26ed47ec96f4307fc33718652f3fce6a604caa9e9544c85c8bffdd09e17a9b67`
