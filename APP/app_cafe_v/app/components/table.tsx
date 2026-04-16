import type { StyleProp, TextStyle, ViewStyle } from "react-native";
import { FlatList, Text, View } from "react-native";
import React from "react";

type MenuItemLike = {
  id?: number | string;
  name?: string;
  description?: string;
  price?: number;
};

type Props = {
  theadData?: Array<string | number>;
  tbodyData?: Array<{ id?: string | number; items?: Array<unknown> }>;
  tableData?: MenuItemLike[]; // backward-compat: list of objects with {id,name}
  style?: StyleProp<ViewStyle>;
  cellStyle?: StyleProp<TextStyle>;
  headerCellStyle?: StyleProp<TextStyle>;
};

const baseCell: ViewStyle = {
  flex: 1,
  paddingVertical: 10,
  paddingHorizontal: 12,
  borderWidth: 1,
  borderColor: "#e5e7eb",
};

const baseCellText: TextStyle = {
  fontSize: 14,
  color: "#111827",
};

const baseHeaderCellText: TextStyle = {
  ...baseCellText,
  fontWeight: "600",
};

const Table = ({
  theadData = [],
  tbodyData = [],
  tableData,
  style,
  cellStyle,
  headerCellStyle,
}: Props) => {
  // If caller passed `tableData` (old prop), convert it to `tbodyData`
  const normalizedBody: Array<{ id?: string | number; items?: Array<unknown> }> =
    tbodyData.length > 0
      ? tbodyData
      : (tableData ?? []).map((item) => ({
          id: item?.id,
          items: [item?.name ?? ""],
        }));

  const Header = () => {
    if (theadData.length === 0) return null;
    return (
      <View style={{ flexDirection: "row", backgroundColor: "#f6f7f9" }}>
        {theadData.map((h, idx) => (
          <View key={idx} style={baseCell}>
            <Text style={[baseHeaderCellText, headerCellStyle]} numberOfLines={1}>
              {String(h)}
            </Text>
          </View>
        ))}
      </View>
    );
  };

  const Row = ({ data = [] as Array<unknown> }) => (
    <View style={{ flexDirection: "row" }}>
      {data.map((item, idx) => (
        <View key={idx} style={baseCell}>
          <Text style={[baseCellText, cellStyle]}>{String(item ?? "")}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <View
      style={[
        {
          width: "100%",
          backgroundColor: "#fff",
        },
        style,
      ]}
    >
      <Header />
      <FlatList
        data={normalizedBody}
        renderItem={({ item }) => <Row data={item.items ?? []} />}
        keyExtractor={(item, index) => String(item?.id ?? index)}
      />
    </View>
  );

}
export default Table