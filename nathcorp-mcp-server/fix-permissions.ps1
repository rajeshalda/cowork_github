# Fix Managed Identity permissions for nathcorp-mcp-server
# Run this once: .\fix-permissions.ps1

$ManagedIdentityId = "d1f791c6-6815-4a51-a0f1-36c81be14443"
$SubscriptionId    = "1e39f927-7704-4a40-8d57-6916a2ff5ce1"
$ResourceGroup     = "rajesh-cowork"
$Role              = "Azure AI Developer"

Write-Host "Switching to Foundry subscription..." -ForegroundColor Cyan
az account set --subscription $SubscriptionId
Write-Host "Subscription: $SubscriptionId" -ForegroundColor Green

$Scope = "/subscriptions/$SubscriptionId/resourceGroups/$ResourceGroup"
Write-Host "Assigning '$Role' to Managed Identity on $ResourceGroup..." -ForegroundColor Cyan

az role assignment create `
    --assignee $ManagedIdentityId `
    --role $Role `
    --scope $Scope

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nDone! Role assigned successfully." -ForegroundColor Green
    Write-Host "Wait 1-2 minutes for permissions to propagate, then test in Cowork." -ForegroundColor Yellow
} else {
    Write-Host "`nFailed. Check if you have Owner/User Access Administrator on rajesh-cowork resource group." -ForegroundColor Red
}
