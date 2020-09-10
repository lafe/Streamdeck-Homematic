$streamDeckProcesses = Get-Process StreamDeck 

if($streamDeckProcesses.Count -gt 1) {
    Write-Host "There is more than one StreamDeck instance running. Cannot continue."
    return
}


$streamDeck = $streamDeckProcesses[0]
Write-Host "Killing existing process $($streamDeck.MainWindowTitle)"
$mainModule = $streamDeck.MainModule
$streamDeck.Kill($true)

Write-Host "Starting $($mainModule.ModuleName)"
Start-Process -FilePath $mainModule.FileName