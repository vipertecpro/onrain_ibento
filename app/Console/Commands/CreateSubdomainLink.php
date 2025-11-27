<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Symfony\Component\Process\Process;

class CreateSubdomainLink extends Command
{
    protected $signature = 'herd:subdomain
        {subdomain?}
        {--old=}
        {--delete : Remove a subdomain completely}';

    protected $description = 'Create, update or delete a Herd subdomain (Windows only)';

    public function handle()
    {
        $domain = config('app.domain') ?? 'onrain_ibento.test';
        $hostsPath = 'C:\Windows\System32\drivers\etc\hosts';

        if (!file_exists($hostsPath)) {
            $this->error("Hosts file not found at {$hostsPath}");
            return 1;
        }

        $subdomain = $this->argument('subdomain');
        $old = $this->option('old');
        $delete = $this->option('delete');

        $newFull = $subdomain ? "{$subdomain}.{$domain}" : null;
        $oldFull = $old ? "{$old}.{$domain}" : null;

        // READ HOSTS FILE
        $hosts = file($hostsPath, FILE_IGNORE_NEW_LINES);

        // --------------------------
        // DELETE MODE
        // --------------------------
        if ($delete && $oldFull) {
            $this->removeHostEntry($hostsPath, $hosts, $oldFull);
            $this->unlinkHerd($oldFull);
            $this->flushDNS();
            $this->info("Deleted subdomain: {$oldFull}");
            return 0;
        }

        // --------------------------
        // UPDATE MODE
        // --------------------------
        if ($oldFull && $newFull) {
            $this->removeHostEntry($hostsPath, $hosts, $oldFull);
            $this->unlinkHerd($oldFull);

            $this->addHostEntry($hostsPath, $newFull);
            $this->linkHerd($newFull);
            $this->flushDNS();

            $this->info("Updated subdomain: {$oldFull} → {$newFull}");
            return 0;
        }

        // --------------------------
        // CREATE MODE
        // --------------------------
        if ($newFull) {
            $this->addHostEntry($hostsPath, $newFull);
            $this->linkHerd($newFull);
            $this->flushDNS();

            $this->info("Created subdomain: {$newFull}");
            return 0;
        }

        $this->error("Invalid usage.");
        return 1;
    }

    private function removeHostEntry($hostsPath, $hosts, $full)
    {
        $this->info("Removing hosts entry: {$full}");

        $filtered = [];
        foreach ($hosts as $line) {
            if (!preg_match('/\b' . preg_quote($full, '/') . '\b/i', $line)) {
                $filtered[] = $line;
            }
        }

        file_put_contents($hostsPath, implode(PHP_EOL, $filtered) . PHP_EOL);
    }

    private function addHostEntry($hostsPath, $full)
    {
        $hosts = file_get_contents($hostsPath);

        if (!preg_match('/\b' . preg_quote($full, '/') . '\b/i', $hosts)) {
            file_put_contents($hostsPath, PHP_EOL . "127.0.0.1    {$full}" . PHP_EOL, FILE_APPEND);
            $this->info("Added to hosts: {$full}");
        } else {
            $this->info("Hosts entry already exists.");
        }
    }

    private function unlinkHerd($full)
    {
        $this->info("Unlinking herd: {$full}");
        $proc = new Process(['herd', 'unlink', $full]);
        $proc->run();
    }

    private function linkHerd($full)
    {
        $this->info("Linking herd: {$full}");
        $proc = new Process(['herd', 'link', $full]);
        $proc->run();
    }

    private function flushDNS()
    {
        $this->info("Flushing DNS...");
        (new Process(['ipconfig', '/flushdns']))->run();
    }
}
