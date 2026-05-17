import { createSelector } from "reselect";
import { AppRootState } from "../../../lib/types/screen";

const selectHomePage = (state: AppRootState) => state.homePage;

export const retrievePopularProducts = createSelector(
  selectHomePage,
  (homePage) => homePage.popularProducts
);

export const retrieveNewProducts = createSelector(
  selectHomePage,
  (homePage) => homePage.newProducts
);

export const retrieveTopUsers = createSelector(
  selectHomePage,
  (homePage) => homePage.topUsers
);
