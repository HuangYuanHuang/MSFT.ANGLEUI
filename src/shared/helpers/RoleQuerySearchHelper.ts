export class RoleQuerySrarchHelper {

    static RoleArray = ['School', 'Country', 'ASPnet', 'Admin'];
    static GetSearchQuery(role: string, country: string, school: string): string[] {
        if (role.toUpperCase().includes('ASPnet'.toUpperCase())) {
            return ['', ''];
        } else if (role.toUpperCase().includes('Country'.toUpperCase())) {
            return [country, ''];
        } else if (role.toUpperCase().includes('School'.toUpperCase())) {
            return [country, school];
        } else if (role.toUpperCase().includes('Admin'.toUpperCase())) {
            return ['', ''];
        }
        return ['Country', 'School'];
    }
}
