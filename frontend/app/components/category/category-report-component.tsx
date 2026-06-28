import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

type Category = {
  id: number;
  category_name: string;
};

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 15,
    marginBottom: 20,
    textAlign: "center",
  },
  table: {
    display: "flex",
    width: "100%",
  },
  row: {
    flexDirection: "row",
    borderBottom: "1px solid #ccc",
    paddingVertical: 5,
     
  },
  categoryHeader: {
    fontWeight: "bold",
     flexDirection: "row",
      marginTop: 5,
      borderBottom: 1,
      paddingBottom: 3,
      backgroundColor: "black",
      color: "white",
      paddingVertical: "3px"
  },
  idCol: {
    width: "15%",
    fontSize:"10",
  },
  nameCol: {
    width: "35%",
    fontSize:"10",
  },
  pageNumber: {
    position: 'absolute',
    fontSize: 9,
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: '#999',
  },
  date: {
    fontSize: 10,
    textAlign:'right',
    marginBottom:'2px'
  },
});

export function CategoryReport({categories,}: {categories: Category[];
})

{
    const generatedAt = new Date().toLocaleString();
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          Category Report
        </Text>
         <Text style={styles.date}>
            Generated: {generatedAt}
          </Text>

        <View style={styles.table}>
          <View style={[styles.categoryHeader]}>
            <Text style={styles.idCol}>ID</Text>
            <Text style={styles.nameCol}>Name</Text>
          </View>

          {categories.map((category) => (
            <View
              key={category.id}
              style={styles.row}
            >
              <Text style={styles.idCol}>
                {category.id}
              </Text>

              <Text style={styles.nameCol}>
                {category.category_name}
              </Text>
            </View>
          ))}
        </View>
        <Text style={styles.pageNumber} render={({ pageNumber, totalPages }) => (
        `${pageNumber} / ${totalPages}`
      )} fixed />
      </Page>
    </Document>
  );
}