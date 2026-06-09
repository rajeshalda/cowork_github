# NathCorp MCP Server — Azure App Service Deployment Script
# Run this ONCE to create Azure resources and deploy
# Prerequisites: Azure CLI installed + logged in (az login)

$ResourceGroup = "nathcorp-cowork-rg"
$AppServicePlan = "nathcorp-cowork-plan"
$WebAppName = "nathcorp-mcp-server"
$Location = "eastasia"

# --- FILL THESE IN BEFORE RUNNING ---
$SnowInstanceUrl  = "https://dev249650.service-now.com"
$SnowClientId     = "d18b020ea85841079e001bfc71da7d22"
$SnowClientSecret = Read-Host "Enter ServiceNow Client Secret" -AsSecureString
$SnowClientSecret = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
    [Runtime.InteropServices.Marshal]::SecureStringToBSTR($SnowClientSecret)
)
# ------------------------------------

Write-Host "`n--- STEP 1: Login to Azure ---" -ForegroundColor Cyan
az login

Write-Host "`n--- STEP 2: Create Resource Group ---" -ForegroundColor Cyan
az group create --name $ResourceGroup --location $Location

Write-Host "`n--- STEP 3: Create App Service Plan (B1 = Basic, ~$13/month) ---" -ForegroundColor Cyan
az appservice plan create `
    --name $AppServicePlan `
    --resource-group $ResourceGroup `
    --sku B1 `
    --is-linux

Write-Host "`n--- STEP 4: Create Web App ---" -ForegroundColor Cyan
az webapp create `
    --name $WebAppName `
    --resource-group $ResourceGroup `
    --plan $AppServicePlan `
    --runtime "NODE:18-lts"

Write-Host "`n--- STEP 5: Set Environment Variables (Secrets) ---" -ForegroundColor Cyan
az webapp config appsettings set `
    --name $WebAppName `
    --resource-group $ResourceGroup `
    --settings `
        SNOW_INSTANCE_URL="$SnowInstanceUrl" `
        SNOW_CLIENT_ID="$SnowClientId" `
        SNOW_CLIENT_SECRET="$SnowClientSecret" `
        WEBSITE_NODE_DEFAULT_VERSION="~18"

Write-Host "`n--- STEP 6: Deploy Code ---" -ForegroundColor Cyan
az webapp up `
    --name $WebAppName `
    --resource-group $ResourceGroup `
    --runtime "NODE:18-lts"

Write-Host "`n--- DONE ---" -ForegroundColor Green
Write-Host "MCP Server URL : https://$WebAppName.azurewebsites.net" -ForegroundColor Green
Write-Host "Health check   : https://$WebAppName.azurewebsites.net/" -ForegroundColor Green
Write-Host "MCP manifest   : https://$WebAppName.azurewebsites.net/.well-known/mcp" -ForegroundColor Green
Write-Host "`nAdd this URL to manifest.json agentConnectors section." -ForegroundColor Yellow
