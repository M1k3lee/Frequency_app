# PowerShell script to generate basic launcher icons
# This creates simple colored square PNG files as placeholders

$iconSizes = @{
    "mipmap-mdpi" = 48
    "mipmap-hdpi" = 72
    "mipmap-xhdpi" = 96
    "mipmap-xxhdpi" = 144
    "mipmap-xxxhdpi" = 192
}

$basePath = "android\app\src\main\res"

foreach ($density in $iconSizes.Keys) {
    $size = $iconSizes[$density]
    $iconPath = Join-Path $basePath $density
    
    # Create a simple colored square using .NET Graphics
    Add-Type -AssemblyName System.Drawing
    
    $bitmap = New-Object System.Drawing.Bitmap($size, $size)
    $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
    
    # Fill with a gradient-like color (purple/blue theme for zen app)
    $brush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
        [System.Drawing.Point]::new(0, 0),
        [System.Drawing.Point]::new($size, $size),
        [System.Drawing.Color]::FromArgb(100, 50, 150),
        [System.Drawing.Color]::FromArgb(50, 100, 200)
    )
    $graphics.FillRectangle($brush, 0, 0, $size, $size)
    
    # Add a simple circle in the center
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::White, [Math]::Max(2, $size / 24))
    $graphics.DrawEllipse($pen, $size / 4, $size / 4, $size / 2, $size / 2)
    
    # Save as PNG
    $bitmap.Save("$iconPath\ic_launcher.png", [System.Drawing.Imaging.ImageFormat]::Png)
    $bitmap.Save("$iconPath\ic_launcher_round.png", [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Clean up
    $graphics.Dispose()
    $bitmap.Dispose()
    $brush.Dispose()
    $pen.Dispose()
}

Write-Host "Icons generated successfully!"

