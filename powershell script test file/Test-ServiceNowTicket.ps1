# NathCorp — ServiceNow Ticket Creation API Test
# Run this script to verify OAuth + ticket creation works before building MCP server

$InstanceUrl  = "https://dev249650.service-now.com"
$ClientId     = "d18b020ea85841079e001bfc71da7d22"

# Prompt for secret securely — not stored in file
$ClientSecret = Read-Host "Enter Client Secret" -AsSecureString
$ClientSecret = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($ClientSecret)
)

Write-Host "`n--- STEP 1: Getting OAuth Token ---" -ForegroundColor Cyan

try {
    $tokenResponse = Invoke-RestMethod -Method POST `
        -Uri "$InstanceUrl/oauth_token.do" `
        -ContentType "application/x-www-form-urlencoded" `
        -Body @{
            grant_type    = "client_credentials"
            client_id     = $ClientId
            client_secret = $ClientSecret
        }

    $token = $tokenResponse.access_token
    Write-Host "Token received successfully!" -ForegroundColor Green
    Write-Host "Token (first 50 chars): $($token.Substring(0, [Math]::Min(50, $token.Length)))..."
} catch {
    Write-Host "FAILED to get token: $_" -ForegroundColor Red
    exit
}

Write-Host "`n--- STEP 2: Creating Incident (Ticket) ---" -ForegroundColor Cyan

try {
    $headers = @{
        Authorization  = "Bearer $token"
        "Content-Type" = "application/json"
        Accept         = "application/json"
    }

    $body = @{
        short_description = "VPN not working - Test from Cowork"
        description       = "This is a test ticket created via Cowork MCP API test. If you see this ticket, the API is working correctly."
        priority          = "3"
        assignment_group  = "IT Support"
    } | ConvertTo-Json

    $ticket = Invoke-RestMethod -Method POST `
        -Uri "$InstanceUrl/api/now/table/incident" `
        -Headers $headers `
        -Body $body

    Write-Host "Ticket created successfully!" -ForegroundColor Green
    Write-Host "Ticket Number : $($ticket.result.number)"
    Write-Host "Ticket SysID  : $($ticket.result.sys_id)"
    Write-Host "State         : $($ticket.result.state)"
    Write-Host "`nVerify in ServiceNow: $InstanceUrl/nav_to.do?uri=incident.do?sysparm_query=number=$($ticket.result.number)"
} catch {
    Write-Host "FAILED to create ticket: $_" -ForegroundColor Red
}
