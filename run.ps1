# Change to script directory
Set-Location $PSScriptRoot

# Check if pm2 is available
$pm2Available = Get-Command pm2 -ErrorAction SilentlyContinue
if (-not $pm2Available) {
    Write-Host "Library PM2 missing. Install? (Y/N)"
    $install = Read-Host
    if ($install -ne 'Y' -and $install -ne 'y') {
        Write-Host "Script cancelled."
        Read-Host "Press Enter to exit"
        exit
    }
    npm install pm2 -g
    Clear-Host
}

Write-Host "1: Default (Logger) Mode"
Write-Host "2: Tracker Mode"
Write-Host "3: Time Game"
Write-Host "4: Remove Service"
Write-Host "Choose an option (1-4):"

do {
    $choice = Read-Host
} while ($choice -notin @('1','2','3','4'))

Clear-Host

switch ($choice) {
    '1' {
        pm2 start pm2.config.js
        pm2 save
        # Startup doesn't work at the moment
        # pm2 startup
    }
    '2' {
        # pm2 start pm2.track.config.js
        Write-Host "This option is not supported right now."
        Read-Host "Press Enter to continue"
        exit
    }
    '3' {
        bun . timegame
    }
    '4' {
        pm2 delete global-keylistener
    }
}

Write-Host "Script finished."
Read-Host "Press Enter to exit"