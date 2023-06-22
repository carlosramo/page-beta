import styles from "./search.module.css";
import classNames from "classnames";
import { useMain, setSearch } from "vStore/main";
let searchTout;
export default function Search() {
  const { search } = useMain();
  const onSearchInput = (e) => {
    clearTimeout(searchTout);
    const value = e.target.value;
    searchTout = setTimeout(async () => {
      setSearch(value);
    }, 500);
  };
  const clearSearch = () => {
    setSearch("");
  };
  return (
    <div className={styles.main}>
      <div className={styles.search}>
        <div>🔎</div>

        <input
          onClick={(e) => {
            e.stopPropagation();
          }}
          onChange={onSearchInput}
          defaultValue={search}
          placeholder="Buscar"
        />
        <button
          className={classNames("", { disabled: search == "" })}
          disabled={search == ""}
          onClick={clearSearch}
        >
          borrar
        </button>
      </div>
    </div>
  );
}
