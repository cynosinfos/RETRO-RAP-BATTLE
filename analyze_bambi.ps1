Add-Type -AssemblyName System.Drawing

$path = "c:\Users\Dziubasek\.gemini\antigravity\scratch\fighting_game\img\bambi_500.png"
if (-not (Test-Path $path)) {
    Write-Host "File not found: $path"
    exit
}

$bmp = [System.Drawing.Bitmap]::FromFile($path)
$w = $bmp.Width
$h = $bmp.Height

Write-Host "Image Size: $w x $h"

# We assume 4 rows based on previous context.
# Let's scan each row's vertical bounds.
# A row is $h / 4? Or fixed 500?
# User said "bambi_500", implying 500px size?
# Let's check chunks of 500px.

$chunkHeight = 500
$numChunks = [Math]::Ceiling($h / $chunkHeight)

for ($c = 0; $c -lt $numChunks; $c++) {
    $minY = -1
    $maxY = -1
    $startY = $c * $chunkHeight
    $endY = [Math]::Min((($c + 1) * $chunkHeight) - 1, $h - 1)

    # Scan from top of chunk down
    for ($y = $startY; $y -le $endY; $y++) {
        $hasContent = $false
        for ($x = 0; $x -lt $w; $x++) {
            if ($bmp.GetPixel($x, $y).A -gt 10) {
                $hasContent = $true
                break
            }
        }
        if ($hasContent) {
            $minY = $y
            break
        }
    }

    # Scan from bottom of chunk up
    if ($minY -ne -1) {
        for ($y = $endY; $y -ge $minY; $y--) {
            $hasContent = $false
            for ($x = 0; $x -lt $w; $x++) {
                if ($bmp.GetPixel($x, $y).A -gt 10) {
                    $hasContent = $true
                    break
                }
            }
            if ($hasContent) {
                $maxY = $y
                break
            }
        }
    }

    $relativeMin = if ($minY -ne -1) { $minY - $startY } else { "None" }
    $relativeMax = if ($maxY -ne -1) { $maxY - $startY } else { "None" }
    
    Write-Host "Row $c ($startY-$endY): Content Y range: $relativeMin to $relativeMax"
}

$bmp.Dispose()
