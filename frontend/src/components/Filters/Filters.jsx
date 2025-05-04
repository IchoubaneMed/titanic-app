import styles from "../../styles/components/Filters.module.css";


const Filters = ({ filters, onChange }) => (
    <div className={styles.filters}>
        <select name="sex" value={filters.sex} onChange={onChange}>
            <option value="">All Sexes</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
        </select>

        <select name="survived" value={filters.survived} onChange={onChange}>
            <option value="">All</option>
            <option value="true">Survived</option>
            <option value="false">Did Not Survive</option>
        </select>

        <select name="pclass" value={filters.pclass} onChange={onChange}>
            <option value="">All Classes</option>
            <option value="1">1st</option>
            <option value="2">2nd</option>
            <option value="3">3rd</option>
        </select>
    </div>
);

export default Filters;