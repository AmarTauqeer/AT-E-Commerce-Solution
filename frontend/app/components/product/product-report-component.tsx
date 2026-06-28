import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";

type Product = {
  id: number;
  product_name: string;
  price: number;
  category_name: string;
  product_description: string;
  created_at: Date;
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
  productHeader: {
    fontWeight: "bold",
    flexDirection: "row",
    marginTop: 5,
    borderBottom: 1,
    paddingBottom: 3,
    backgroundColor: "black",
    color: "white",
    paddingVertical: "3px"
  },
  id: {
    width: "5%",
    fontSize: "8",
  },
  name: {
    width: "25%",
    fontSize: "8",
  },
  description: {
    width: "45%",
    fontSize: "8",
  },
  category: {
    width: "8%",
    fontSize: "8",
    paddingLeft: "2px"
  },
  price: {
    width: "8%",
    fontSize: "8",
    textAlign: "right",
    paddingRight: "5px"
  },
  createdAt: {
    width: "10%",
    fontSize: "8",
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
    fontSize: 8,
    textAlign: 'right',
    marginBottom: '2px'
  },
});

export function ProductReport({ products, }: {
  products: Product[];
}) {

  function formatDate(date: any) {
    return (
      String(date.getDate()).padStart(2, "0") +
      "-" +
      String(date.getMonth() + 1).padStart(2, "0") +
      "-" +
      String(date.getFullYear()).slice(-2)
    );
  }
  const generatedAt = formatDate(new Date())
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          Product Report
        </Text>
        <Text style={styles.date}>
          Generated: {generatedAt}
        </Text>

        <View style={styles.table}>
          <View style={styles.productHeader}>
            <Text style={styles.id}>ID</Text>
            <Text style={styles.name}>Name</Text>
            <Text style={styles.description}>Description</Text>
            <Text style={styles.category}>Category</Text>
            <Text style={styles.price}>Price</Text>
            <Text style={styles.createdAt}>Date</Text>
          </View>

          {products.map((product) => (
            <View
              key={product.id}
              style={styles.row}
            >
              <Text style={styles.id}>
                {product.id}
              </Text>

              <Text style={styles.name}>
                {product.product_name}
              </Text>

              <Text style={styles.description}>
                {product.product_description}
              </Text>

              <Text style={styles.category}>
                {product.category_name}
              </Text>

              <Text style={styles.price}>
                {product.price.toFixed(2)}
              </Text>

              <Text style={styles.createdAt}>
                {formatDate(new Date(product.created_at))}
                {/* {product.created_at.toString()} */}
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