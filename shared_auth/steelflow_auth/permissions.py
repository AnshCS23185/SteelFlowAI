import enum

class AccessLevel(str, enum.Enum):
    FULL = "full"
    READ = "read"
    ASSIGNED = "assigned" # RLAC: Only assigned items
    NONE = "none"

class AppModule(str, enum.Enum):
    MODULE1_PROJECTS = "module1_projects"
    MODULE2_INVENTORY = "module2_inventory"
    MODULE3_MANUFACTURING = "module3_manufacturing"
    MODULE4_DISPATCH = "module4_dispatch"
    MODULE5_TRANSPORTATION = "module5_transportation"

# PBAC Mapping: Role -> Module -> AccessLevel
ROLE_PERMISSIONS = {
    "super_admin": {
        AppModule.MODULE1_PROJECTS: AccessLevel.FULL,
        AppModule.MODULE2_INVENTORY: AccessLevel.READ,
        AppModule.MODULE3_MANUFACTURING: AccessLevel.READ,
        AppModule.MODULE4_DISPATCH: AccessLevel.READ,
        AppModule.MODULE5_TRANSPORTATION: AccessLevel.READ,
    },
    "project_manager": {
        AppModule.MODULE1_PROJECTS: AccessLevel.ASSIGNED,
        AppModule.MODULE2_INVENTORY: AccessLevel.READ,
        AppModule.MODULE3_MANUFACTURING: AccessLevel.FULL,
        AppModule.MODULE4_DISPATCH: AccessLevel.FULL,
        AppModule.MODULE5_TRANSPORTATION: AccessLevel.FULL,
    },
    "inventory_manager": {
        AppModule.MODULE1_PROJECTS: AccessLevel.NONE,
        AppModule.MODULE2_INVENTORY: AccessLevel.FULL,
        AppModule.MODULE3_MANUFACTURING: AccessLevel.READ,
        AppModule.MODULE4_DISPATCH: AccessLevel.READ,
        AppModule.MODULE5_TRANSPORTATION: AccessLevel.READ,
    },
    "client": {
        AppModule.MODULE1_PROJECTS: AccessLevel.ASSIGNED,
        AppModule.MODULE2_INVENTORY: AccessLevel.NONE,
        AppModule.MODULE3_MANUFACTURING: AccessLevel.READ, # Client can view progress
        AppModule.MODULE4_DISPATCH: AccessLevel.READ,
        AppModule.MODULE5_TRANSPORTATION: AccessLevel.READ,
    }
}
