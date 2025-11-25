<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Spatie\Permission\PermissionRegistrar;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[PermissionRegistrar::class]->forgetCachedPermissions();

        // Create Permissions (you can extend later)
        $permissions = [
            'manage exhibitions',
            'manage roles & permissions',
            'manage halls',
            'manage stall categories',
            'manage stalls',
            'manage visitors',
            'manage exhibitors',
            'manage global settings',
            'access dashboard',
            'access frontend',
        ];

        foreach ($permissions as $perm) {
            Permission::create(['name' => $perm]);
        }

        // Super Admin Role → has everything
        $admin = Role::create(['name' => 'admin']);
        $admin->givePermissionTo(Permission::all());

        // Developer Role → same as admin
        $developer = Role::create(['name' => 'developer']);
        $developer->givePermissionTo(Permission::all());

        // Exhibitor Role
        $exhibitor = Role::create(['name' => 'exhibitor']);
        $exhibitor->givePermissionTo([
            'access dashboard',
            'manage stalls',
            'access frontend',
        ]);

        // Visitor Role (regular attendee)
        $visitor = Role::create(['name' => 'visitor']);
        $visitor->givePermissionTo('access frontend');
    }
}
