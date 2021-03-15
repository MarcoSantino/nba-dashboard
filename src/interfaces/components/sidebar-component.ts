export interface SidebarComponent {
    seasonSelected: string;
    seasons: string[];
    addSeasonsFunction: (props: string[]) => void;
    selectSeasonsFunction: (props: string) => void;
}
