export interface SidebarComponent {
    seasonSelected: string;
    seasons: string[];
    addSeasonsFunction: (props: string[]) => any;
    selectSeasonsFunction: (props: string) => any;
}
