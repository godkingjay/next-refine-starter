import { siteConfig } from '@utils';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { useSidebar } from './sidebar';

interface ThemeStoreState {
	theme: string;
	setTheme: (theme: string) => void;
	radius: number;
	setRadius: (value: number) => void;
	layout: string;
	setLayout: (value: string) => void;
	navbarType: string;
	setNavbarType: (value: string) => void;
	footerType: string;
	setFooterType: (value: string) => void;
	isRtl: boolean;
	setRtl: (value: boolean) => void;
}

export const useThemeStore = create<ThemeStoreState>()(
	persist(
		(set) => ({
			theme: siteConfig.theme,
			setTheme: (theme) => set({ theme }),
			radius: siteConfig.radius,
			setRadius: (value) => set({ radius: value }),
			layout: siteConfig.layout,
			setLayout: (value) => {
				set({ layout: value });

				// If the new layout is "semibox," also set the sidebarType to "popover"
				if (value === 'semibox') {
					useSidebar.setState({ sidebarType: 'popover' });
				}
				if (value === 'horizontal') {
					useSidebar.setState({ sidebarType: 'classic' });
				}
				//
				if (value === 'horizontal') {
					// update  setNavbarType
					useThemeStore.setState({ navbarType: 'sticky' });
				}
			},
			navbarType: siteConfig.navbarType,
			setNavbarType: (value) => set({ navbarType: value }),
			footerType: siteConfig.footerType,
			setFooterType: (value) => set({ footerType: value }),
			isRtl: false,
			setRtl: (value) => set({ isRtl: value }),
		}),
		{ name: 'theme-store', storage: createJSONStorage(() => localStorage) }
	)
);
