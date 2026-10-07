# Run this from inside your dezzlay-store folder:
#   powershell -ExecutionPolicy Bypass -File update-contact-info.ps1
#
# This removes Instagram/Pinterest/TikTok links, removes the phone number,
# and switches the contact email to dezzlaypakistan@gmail.com across all
# pages. It does NOT touch your product photos or products.json.

$files = @("index.html", "shop.html", "product.html", "cart.html", "about.html", "contact.html")

foreach ($f in $files) {
    if (-not (Test-Path $f)) {
        Write-Host "Skipping $f (not found in this folder)"
        continue
    }

    $content = Get-Content $f -Raw

    # Swap the email address everywhere
    $content = $content -replace 'hello@dezzlay\.example', 'dezzlaypakistan@gmail.com'

    # Remove the phone number line from "Stay in touch"
    $content = $content -replace '\s*<li><a href="tel:\+18005551234">\+1 \(800\) 555-1234</a></li>', ''

    # Remove the whole Instagram/Pinterest/TikTok block
    $content = [regex]::Replace($content, '\s*<div class="social-row">[\s\S]*?</div>', '')

    Set-Content $f -Value $content -NoNewline
    Write-Host "Updated $f"
}

# contact.html has one more spot: the "Customer care" box with phone + hours
if (Test-Path "contact.html") {
    $c = Get-Content "contact.html" -Raw
    $old = '<p style="color:var(--muted);">dezzlaypakistan@gmail.com<br>+1 (800) 555-1234<br>Mon–Fri, 9am–5pm GMT</p>'
    $new = '<p style="color:var(--muted);"><a href="mailto:dezzlaypakistan@gmail.com">dezzlaypakistan@gmail.com</a></p>'
    $c = $c.Replace($old, $new)
    Set-Content "contact.html" -Value $c -NoNewline
    Write-Host "Updated contact.html customer care box"
}

Write-Host ""
Write-Host "Done. Run 'git status' to see what changed, then commit and push."
