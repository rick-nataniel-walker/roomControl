<template>
  <ContentWrapper title="Relatórios" class="reports-page">
    <template #header>
      <div class="period-toolbar">
        <div class="period-presets" aria-label="Período do relatório">
          <button
            v-for="preset in presets"
            :key="preset.days"
            type="button"
            :class="{ selected: selectedPreset === preset.days }"
            :aria-pressed="selectedPreset === preset.days"
            @click="setPeriod(preset.days)"
          >
            {{ preset.label }}
          </button>
        </div>
        <div class="period-dates">
          <FormGroup
            aria-label="Data inicial"
            type="date"
            v-model="filters.startDate"
            required
            :max="filters.endDate"
            @update:model-value="onDateChange"
          />
          <span>—</span>
          <FormGroup
            aria-label="Data final"
            type="date"
            v-model="filters.endDate"
            required
            :min="filters.startDate"
            @update:model-value="onDateChange"
          />
        </div>
      </div>
    </template>
    <template #body>
      <div class="report-content">
        <p class="report-subtitle">Analise o desempenho do seu alojamento.</p>
        <p v-if="validationError" role="alert" class="text-red-600">
          {{ validationError }}
        </p>
        <p v-if="summaryError" role="alert" class="text-red-600">
          {{ summaryError }}
        </p>
        <div class="report-kpis">
          <StatisticCard
            v-for="card in statisticCards"
            :key="card.id"
            :icon="card.icon"
            :label="card.label"
            :number="card.number"
            :bg-color="card.bgColor"
            :color="card.color"
          />
        </div>
        <p class="scope-note">
          {{ applied.startDate }} — {{ applied.endDate }} · Totais do período,
          independentemente do quarto, estado ou página da tabela. Perdas no
          período: <strong>{{ money(summary?.overdue?.loss) }}</strong> · Tempo
          vencido: {{ duration(summary?.overdue?.seconds) }}.
        </p>
        <ReportCharts
          :summary="summary"
          :reservations="chartRows"
          :loading="chartsLoading"
          :error="chartsError"
        />
        <section
          class="reservations-panel"
          aria-label="Atividade das reservas"
          :aria-busy="loading"
        >
          <div class="panel-heading">
            <h2>Últimas Reservas</h2>
            <RouterLink :to="{ name: 'reservations' }"
              >Ver todas as reservas →</RouterLink
            >
          </div>
          <div class="table-filters">
            <FormGroup
              label="Pesquisar por"
              input-type="select"
              v-model="filters.mode"
              @update:model-value="queueSearch()"
            >
              <option value="dates">Data de entrada e estado</option>
              <option value="all">Todas as reservas</option>
              <option value="room">Nome do quarto</option>
              <option value="status">Estado</option>
            </FormGroup>
            <FormGroup
              v-if="filters.mode === 'room'"
              label="Nome do quarto"
              v-model="filters.roomName"
              @update:model-value="queueSearch(300)"
              required
              placeholder="Nome ou parte do nome"
            />
            <FormGroup
              v-if="['status', 'dates'].includes(filters.mode)"
              label="Estado"
              input-type="select"
              v-model="filters.status"
              @update:model-value="queueSearch()"
              :required="filters.mode === 'status'"
            >
              <option value="">Todos os estados</option>
              <option v-for="status in statuses" :key="status" :value="status">
                {{ status }}
              </option>
            </FormGroup>
          </div>
          <p class="scope-note">
            Estado atual de cada reserva. Ganhos e perdas abrangem toda a
            reserva. As datas filtram a tabela apenas no modo «Data de entrada e
            estado».
          </p>
          <p v-if="tableError" role="alert" class="text-red-600">
            {{ tableError }}
          </p>
          <MainTable>
            <template #headers>
              <th>Quarto</th>
              <th>Entrada</th>
              <th>Pago até</th>
              <th>Checkout</th>
              <th>Duração</th>
              <th>Estado</th>
              <th>Pagamento</th>
              <th>Ganhos (MZN)</th>
              <th>Perdas (MZN)</th>
              <th>Tempo vencido</th>
            </template>
            <template #body>
              <tr v-if="loading">
                <td colspan="11" role="status">A carregar reservas...</td>
              </tr>
              <tr v-else-if="!rows.length">
                <td colspan="11">
                  {{
                    tableError
                      ? "Não foi possível carregar as reservas. Tente pesquisar novamente."
                      : "Nenhuma reserva encontrada."
                  }}
                </td>
              </tr>
              <template v-else>
                <tr v-for="reservation in rows" :key="reservation.id">
                  <td>{{ reservation.roomName || "—" }}</td>
                  <td>{{ formatDateTime(reservation.checkinTime) }}</td>
                  <td>{{ formatDateTime(reservation.paidUntil) }}</td>
                  <td>{{ formatDateTime(reservation.checkoutTime) }}</td>
                  <td>
                    {{ reservation.stayDuration ?? "—" }}
                    {{ units[reservation.durationUnit] || "" }}
                  </td>
                  <td>
                    <TextBadge
                      :value="reservation.status || '—'"
                      :type="badge(reservation.status)"
                    />
                  </td>
                  <td>
                    {{ reservation.paymentMethod || "—"
                    }}<span class="block text-xs text-slate-500">{{
                      reservation.paymentConfirm
                        ? "Confirmado"
                        : "Não confirmado"
                    }}</span>
                  </td>
                  <td>{{ money(reservation.gain) }}</td>
                  <td>{{ money(reservation.loss) }}</td>
                  <td>{{ duration(reservation.overdueSeconds) }}</td>
                </tr>
              </template>
            </template>
          </MainTable>
          <TablePagination
            v-if="total > 0 && !loading"
            :pagination="pagination"
            @change="changePage"
          />
        </section>
      </div>
    </template>
  </ContentWrapper>
</template>

<script>
import ReportCharts from "@/components/reports/ReportCharts.vue";
import { money, badge } from "@/helpers/GeneralHelper";
import ContentWrapper from "@/components/ContentWrapper.vue";
import FormGroup from "@/components/form/FormGroup.vue";

import StatisticCard from "@/components/shared/StatisticCard.vue";
import TextBadge from "@/components/shared/TextBadge.vue";
import MainTable from "@/components/tables/MainTable.vue";
import TablePagination from "@/components/tables/TablePagination.vue";
import {
  fetchAuditReservations,
  fetchAuditSummary,
  fetchAuditChartReservations,
} from "@/api/reports";
import { formatDateTime } from "@/helpers/DateHelper";
import { paginate, getPaginationControls } from "@/helpers/Paginator";

export default {
  name: "ReportsView",
  components: {
    ReportCharts,
    ContentWrapper,
    FormGroup,

    StatisticCard,
    TextBadge,
    MainTable,
    TablePagination,
  },
  data() {
    const today = formatDateTime(new Date(), false).slice(0, 10);
    const filters = {
      mode: "dates",
      roomName: "",
      status: "",
      startDate: today,
      endDate: today,
    };
    return {
      chartRows: [],
      chartsLoading: false,
      chartsError: "",
      selectedPreset: 1,
      presets: [
        { days: 1, label: "Hoje" },
        { days: 7, label: "Últimos 7 dias" },
        { days: 30, label: "Últimos 30 dias" },
        { days: 0, label: "Personalizado" },
      ],
      filters,
      applied: { ...filters },
      rows: [],
      summary: null,
      total: 0,
      page: 1,
      pageSize: 5,
      loading: false,
      validationError: "",
      tableError: "",
      summaryError: "",
      requestVersion: 0,
      searchTimer: null,
      statuses: [
        "Pagamento Pendente",
        "Activa",
        "Vencida",
        "Completa",
        "Cancelada",
        "Pago",
      ],
      units: { 1: "horas", 2: "dias", 3: "semanas", 4: "meses" },
    };
  },
  computed: {
    occupancy() {
      if (!this.summary || !(this.summary.roomsCount > 0)) return "—";
      return new Intl.NumberFormat("pt-MZ", {
        style: "percent",
        maximumFractionDigits: 1,
      }).format(this.summary.busyRoomsCount / this.summary.roomsCount);
    },
    statisticCards() {
      return [
        {
          id: "reservations",
          color: "text-blue-600",
          bgColor: "bg-blue-100",
          label: "Total de Reservas",
          number: this.summary?.allReservationsCount ?? "—",
          icon: "calendar-days",
        },
        {
          id: "revenue",
          color: "text-green-600",
          bgColor: "bg-green-100",
          label: "Receita Total",
          number: this.money(this.summary?.revenue),
          icon: "fa-arrow-trend-up",
        },
        {
          id: "average-stay",
          color: "text-orange-600",
          bgColor: "bg-orange-100",
          label: "Duração média contratada",
          number: this.averageStay,
          icon: "clock",
        },
        {
          id: "occupancy",
          color: "text-red-600",
          bgColor: "bg-red-100",
          label: "Perdas no período",
          number: this.money(this.summary?.overdue?.loss),
          icon: "fa-arrow-trend-down",
        },
      ];
    },
    averageStay() {
      if (this.chartsLoading || this.chartsError) return "—";
      const hours = this.chartRows
        .map((row) => {
          const start = new Date(row.checkinTime).getTime();
          const end = new Date(row.paidUntil).getTime();
          return row.checkinTime && row.paidUntil && end >= start
            ? (end - start) / 3600000
            : null;
        })
        .filter((value) => value !== null);
      return hours.length
        ? new Intl.NumberFormat("pt-MZ", { maximumFractionDigits: 1 }).format(
            hours.reduce((sum, value) => sum + value, 0) / hours.length
          ) + " horas"
        : "—";
    },
    pagination() {
      return getPaginationControls(
        paginate({
          length: this.total,
          currentPage: this.page,
          itemsPerPage: this.pageSize,
        })
      );
    },
  },
  mounted() {
    this.load(true);
  },
  beforeUnmount() {
    clearTimeout(this.searchTimer);
    this.requestVersion += 1;
  },
  methods: {
    money,
    badge,
    formatDateTime(value) {
      if (!value) return "—";
      const date = new Date(value);
      return Number.isNaN(date.getTime()) ? "—" : formatDateTime(date, false);
    },
    onDateChange() {
      this.selectedPreset = 0;
      this.queueSearch();
    },
    queueSearch(delay = 0) {
      clearTimeout(this.searchTimer);
      this.requestVersion += 1;
      this.loading = false;
      this.chartsLoading = false;
      if (delay) this.searchTimer = setTimeout(() => this.search(), delay);
      else return this.search();
    },
    setPeriod(days) {
      this.selectedPreset = days;
      if (!days) return;
      const end = new Date();
      const start = new Date(end);
      start.setDate(start.getDate() - days + 1);
      this.filters.startDate = formatDateTime(start, false).slice(0, 10);
      this.filters.endDate = formatDateTime(end, false).slice(0, 10);
      return this.queueSearch();
    },
    duration(value) {
      if (value == null || !Number.isFinite(Number(value))) return "—";
      const seconds = Math.max(0, Math.floor(Number(value)));
      return `${Math.floor(seconds / 3600)}h ${Math.floor(
        (seconds % 3600) / 60
      )}min ${seconds % 60}s`;
    },
    search() {
      clearTimeout(this.searchTimer);
      this.validationError = "";
      if (
        !this.filters.startDate ||
        !this.filters.endDate ||
        this.filters.startDate > this.filters.endDate
      )
        this.validationError = "Selecione um intervalo de datas válido.";
      else if (this.filters.mode === "room" && !this.filters.roomName.trim())
        this.validationError = "Indique o nome do quarto.";
      else if (this.filters.mode === "status" && !this.filters.status)
        this.validationError = "Selecione um estado.";
      if (this.validationError) return;
      this.applied = { ...this.filters };
      this.page = 1;
      return this.load(true);
    },
    changePage({ page, pageSize }) {
      this.page = page;
      this.pageSize = pageSize;
      return this.load(false);
    },
    async load(includeSummary) {
      const version = ++this.requestVersion;
      this.loading = true;
      this.tableError = "";
      this.rows = [];
      this.total = 0;
      if (includeSummary) {
        this.chartRows = [];
        this.chartsLoading = true;
        this.chartsError = "";
        this.summary = null;
        this.summaryError = "";
      }
      const requests = [
        fetchAuditReservations(this.applied, this.page - 1, this.pageSize),
      ];
      if (includeSummary)
        requests.push(
          fetchAuditSummary(this.applied),
          fetchAuditChartReservations(this.applied)
        );
      const results = await Promise.allSettled(requests);
      if (version !== this.requestVersion) return;
      if (results[0].status === "fulfilled") {
        const payload = results[0].value.data;
        this.rows = payload.data;
        this.total = payload.totalElements;
      } else
        this.tableError =
          results[0].reason.response?.data?.message ||
          "Erro ao carregar as reservas.";
      if (includeSummary) {
        if (results[1].status === "fulfilled")
          this.summary = results[1].value.data;
        else
          this.summaryError =
            results[1].reason.response?.data?.message ||
            "Erro ao carregar o resumo do período.";
      }
      if (includeSummary) {
        this.chartsLoading = false;
        if (results[2].status === "fulfilled")
          this.chartRows = results[2].value;
        else
          this.chartsError =
            "Não foi possível carregar os gráficos do período.";
      }
      this.loading = false;
    },
  },
};
</script>
<style scoped>
.reports-page {
  @apply bg-[#f1f6fe];
}
.reports-page :deep(.flex.py-8) {
  @apply flex-wrap gap-3.5 pt-4 pb-[30px];
}
.reports-page :deep(.w-full.gap-14) {
  @apply min-w-0;
}
.report-content {
  @apply grid gap-4 pb-7 text-left;
}
.report-subtitle {
  @apply text-[#425779] -mt-5 mb-1.5;
}
.period-toolbar,
.period-dates,
.period-presets {
  @apply flex items-center gap-2;
}
.period-toolbar {
  @apply flex-wrap justify-end;
}
.period-presets {
  @apply gap-0 bg-white border border-[#dbe5f3] rounded-md overflow-hidden;
}
.period-presets button {
  @apply py-2.5 px-3 text-xs text-[#172e53];
}
.period-presets button.selected {
  @apply bg-[#0755e9] text-white;
}
.period-dates {
  @apply text-xs;
}
.period-dates :deep(.form-group) {
  @apply m-0;
}
.period-dates :deep(.form-control) {
  @apply p-2 w-[145px] border-[#dbe5f3];
}
.report-kpis {
  @apply grid grid-cols-4 gap-3.5;
}
.report-kpis :deep(.stat-card) {
  @apply w-full min-h-[115px] p-[18px] bg-white;
}
.report-kpis :deep(.stat-number) {
  @apply text-[clamp(16px,1.55vw,24px)];
}
.report-kpis :deep(.stat-label) {
  @apply text-xs;
}
.scope-note {
  @apply text-xs text-slate-500 leading-[1.6];
}
.reservations-panel {
  @apply p-4 bg-white border border-[#edf2fa] rounded-[10px] min-w-0;
}
.panel-heading {
  @apply flex justify-between items-center mb-3.5 gap-3;
}
.panel-heading h2 {
  @apply font-bold text-[#10194c];
}
.panel-heading a {
  @apply text-[#0755e9] text-xs;
}
.table-filters {
  @apply flex flex-wrap gap-3 items-end;
}
.table-filters :deep(.form-group) {
  @apply mb-2.5 min-w-[170px];
}
.table-filters :deep(.form-control) {
  @apply py-2 px-3 text-xs;
}
.reservations-panel :deep(.main-table-shell) {
  @apply mt-3 shadow-none;
}
.reservations-panel :deep(td),
.reservations-panel :deep(th) {
  @apply py-2.5 px-3 text-xs;
}
.reports-page :deep(.dashboard) {
  @apply bg-[#f1f6fe];
}
@media (max-width: 1100px) {
  .report-kpis {
    @apply grid-cols-2;
  }
}
@media (max-width: 640px) {
  .period-toolbar {
    @apply justify-start;
  }
  .report-kpis {
    @apply grid-cols-1;
  }
  .report-subtitle {
    @apply mt-0;
  }
}
</style>
